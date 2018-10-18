import * as _ from 'lodash';
import { Observable, Subscription, Subject } from 'rxjs';
import { zip } from 'rxjs/observable/zip';

import * as Bluebird from 'bluebird';

import {
    BACnetUnitDataFlow
} from '../../../core/enums';

import {
    IEDEUnit,
    Units,
    UnitStorageProperty,
} from '../../../core/interfaces';

import {
    JalousieMetadata,
    PositionFeedbackAliases,
    PositionModificationAliases,
    RotationFeedbackAliases,
    RotationModificationAliases
} from './jalousie.metadata';
import { CustomUnit } from '../custom.unit';
import { AliasMap } from '../../../core/alias/alias.map';

import * as BACNet from 'tid-bacnet-logic';
import { BACnetJalousieUnitFunctions } from '../../../core/enums';
import { AnalogValueUnit } from '../../native/analog/analog-value/analog-value.unit';
import { MultiStateValueUnit } from '../../native/multi-state/multi-state-value/multi-state-value.unit';

type PositionFeedbackFunction = Units.Jalousie.Position.Feedback.Function<AnalogValueUnit>;
type PositionModificationFunction = Units.Jalousie.Position.Modification.Function<AnalogValueUnit>;
type RotationFeedbackFunction = Units.Jalousie.Rotation.Feedback.Function<AnalogValueUnit>;
type RotationModificationFunction = Units.Jalousie.Rotation.Modification.Function<AnalogValueUnit>;
type ActionFunction = Units.Jalousie.Action.Function<MultiStateValueUnit>;

export class JalousieUnit extends CustomUnit {
    public readonly className: string = 'JalousieUnit';
    public storage: AliasMap<PositionFeedbackFunction|PositionModificationFunction|RotationFeedbackFunction|RotationModificationFunction|ActionFunction>;
    private positionModificationTimer: Subscription;
    private rotationModificationTimer: Subscription;
    private physicalState: Units.Jalousie.State = null;
    private stateModification: Units.Jalousie.State = null;
    private sPosModFlow = new Subject<number>(); // Position Modification Flow
    private sRotModFlow = new Subject<number>(); // Rotation Modification Flow
    private sActionMoveFlow = new Subject(); // Move action flow
    private sStateModificationFlow: Observable<Units.Jalousie.State>;
    private currentActionValue: number;

    /**
     * initUnit - inits the custom unit.
     *
     * @return {void}
     */
    public initUnit (): void {
        super.initUnit();

        this.addMetadata(JalousieMetadata);
    }

    /**
     * startSimulation - starts the simulation logic of the "thermostat" custom unit.
     *
     * @return {void}
     */
    public startSimulation (): void {
        const positionFeedbackFn = this.storage.get(BACnetJalousieUnitFunctions.PositionFeedback) as PositionFeedbackFunction;
        const positionModificationFn = this.storage.get(BACnetJalousieUnitFunctions.PositionModification) as PositionModificationFunction
        if (positionFeedbackFn.unit && positionModificationFn.unit) {
            this.simulatePosition(positionFeedbackFn, positionModificationFn)
        }

        const rotationFeedbackFn = this.storage.get(BACnetJalousieUnitFunctions.RotationFeedback) as RotationFeedbackFunction;
        const rotationModificationFn = this.storage.get(BACnetJalousieUnitFunctions.RotationModification) as RotationModificationFunction;
        if (rotationFeedbackFn.unit && rotationModificationFn.unit) {
            this.simulateRotation(rotationFeedbackFn, rotationModificationFn)
        }

        if (positionFeedbackFn.unit && rotationFeedbackFn.unit) {
            const position = this.getUnitValue(positionFeedbackFn.unit);
            const rotation = this.getUnitValue(rotationFeedbackFn.unit);
            this.physicalState = { position, rotation };
        }

        const actionFn = this.storage.get(BACnetJalousieUnitFunctions.Action) as ActionFunction;
        if (actionFn.unit) {
            this.simulateAction(actionFn);
        }

        this.initStateModificationWatchStream(positionModificationFn.config, rotationModificationFn.config);
    }

    private initStateModificationWatchStream(posModConf: Units.Jalousie.Position.Modification.Config, rotModConf: Units.Jalousie.Rotation.Modification.Config) {

        // start jalousie state modification only if all three values are emited (position, rotation, action move)
        this.sStateModificationFlow = zip(
            this.sPosModFlow,
            this.sRotModFlow,
            this.sActionMoveFlow
        )
        .map(([position, rotation]) => {
            return { position, rotation }
        });
        this.sStateModificationFlow.subscribe((state) => {
                this.adjustRotation(state.rotation, rotModConf.freq)
                    .then(() => {
                        return this.moveJalousie(state.position, posModConf.freq);
                    })
                    .then(() => {
                        this.stopMotion();
                        this.currentActionValue = 2;
                        this.reportStateModification();
                    });
        })
    }


    /**
     * getUnitValue - gets value of the AnalogValueUnit.
     *
     * @param  {AnalogValueUnit} unit - instance of a analog value unit
     * @return {number}
     */
    private getUnitValue (unit: AnalogValueUnit): number {
        const prValueProperty = unit.storage.getProperty(BACNet.Enums.PropertyId.presentValue);
        if (_.isNil(prValueProperty.payload)) {
            return null;
        }
        const prValuePayload = prValueProperty.payload as BACNet.Types.BACnetReal;
        return prValuePayload.value;
    }

    /**
     * genStartPresentValue - generates start value payload for "Present Value" BACnet property.
     *
     * @param  {PositionModificationFunction|RotationModificationFunction} unitFn - unit function
     * @return {BACNet.Types.BACnetReal} - payload of present value property
     */
    private genStartPresentValue (unitFn: PositionModificationFunction|RotationModificationFunction): BACNet.Types.BACnetReal {
        const config = unitFn.config;
        let value = config.min + (config.max - config.min) / 2;
        value = _.round(value, 1)
        return new BACNet.Types.BACnetReal(value);
    }

    /**
     * simulatePosition - generates start value of the dimmer level,
     * gets new payload for levelFeedback unit "Present Value" BACnet property,
     * based on the levelModification unit payload,
     * sets new payload in levelFeedback "Present Value" property.
     *
     * @param  {PositionFeedbackFunction} feedbackFn - thermostat's setpoint Feedback function
     * @param  {PositionModificationFunction} modificationFn - thermostat's setpoint Modification function
     * @return {void}
     */
    private simulatePosition(feedbackFn: PositionFeedbackFunction, modificationFn: PositionModificationFunction): void {
        const feedbackUnit = feedbackFn.unit;
        const modificationUnit = modificationFn.unit;
        const modificationConfig = modificationFn.config;
        modificationUnit.storage.setFlowHandler(BACnetUnitDataFlow.Update, BACNet.Enums.PropertyId.presentValue, (notif: UnitStorageProperty) => {
            modificationUnit.storage.dispatch();
            const posModificationPayload = notif.payload as BACNet.Types.BACnetReal;
            let posModificationValue = +posModificationPayload.getValue();

            if (posModificationValue > modificationConfig.max) {
                posModificationValue =  modificationConfig.max;
            }

            if (posModificationValue < modificationConfig.min) {
                posModificationValue =  modificationConfig.min;
            }

            this.sPosModFlow.next(posModificationValue);
        });

        const startPayload = this.genStartPresentValue(modificationFn);
        feedbackUnit.storage.updateProperty({
            id: BACNet.Enums.PropertyId.presentValue,
            payload: startPayload,
        });
    }

    /**
     * simulateRotation - sets "stateText" BACNet property to stateFeedback unit,
     * gets new payload for stateFeedback unit "Present Value" BACnet property,
     * based on stateModification unit present value & dimmerLEvel present value,
     * sets new payload in stateModificationunit's "Present Value" property.
     *
     * @param {RotationFunction} feedbackFn - light's state feedback function
     * @param {RotationFunction} modificationFn - light's state modification function
     * @return {void}
     */
    private simulateRotation(feedbackFn: RotationFeedbackFunction, modificationFn: RotationModificationFunction): void {
        const feedbackUnit = feedbackFn.unit;
        const modificationUnit = modificationFn.unit;
        const modificationConfig = modificationFn.config;
        modificationUnit.storage.setFlowHandler(BACnetUnitDataFlow.Update, BACNet.Enums.PropertyId.presentValue, (notif: UnitStorageProperty) => {
            modificationUnit.storage.dispatch();
            const rotModificationPayload = notif.payload as BACNet.Types.BACnetReal;
            let rotModificationValue = +rotModificationPayload.getValue();

            if (rotModificationValue > modificationConfig.max) {
                rotModificationValue =  modificationConfig.max;
            }

            if (rotModificationValue < modificationConfig.min) {
                rotModificationValue =  modificationConfig.min;
            }

            this.sRotModFlow.next(rotModificationValue);
        });

        const startPayload = this.genStartPresentValue(modificationFn);
        feedbackUnit.storage.updateProperty({
            id: BACNet.Enums.PropertyId.presentValue,
            payload: startPayload,
        });
    }

    private simulateAction(actionFn: ActionFunction) {
        const actionUnit = actionFn.unit;
        const actionConfig = actionFn.config;
        const stateTextPayload = actionConfig.stateText.map( text => new BACNet.Types.BACnetCharacterString(text));
        actionUnit.storage.updateProperty({
            id: BACNet.Enums.PropertyId.stateText,
            payload: stateTextPayload
        });

        actionUnit.storage.setFlowHandler(BACnetUnitDataFlow.Set, BACNet.Enums.PropertyId.presentValue, (notif: UnitStorageProperty) => {
            const actionPayload = notif.payload as BACNet.Types.BACnetReal;
            let actionValue = +actionPayload.getValue();

            if (actionValue > 0 && actionValue <= actionConfig.stateText.length) {
                actionUnit.storage.updateProperty(notif);
            }
        });

        this.currentActionValue = 2;
        // setting the start value of action unit
        actionUnit.storage.updateProperty({
            id: BACNet.Enums.PropertyId.presentValue,
            payload: new BACNet.Types.BACnetUnsignedInteger(2),
        });

        actionUnit.storage.setFlowHandler(BACnetUnitDataFlow.Update, BACNet.Enums.PropertyId.presentValue, (notif: UnitStorageProperty) => {
            actionUnit.storage.dispatch();
            const actionPayload = notif.payload as BACNet.Types.BACnetReal;
            const actionValue = +actionPayload.getValue();

            // if jalousie is moving, stop anyway ang report its state
            if (this.currentActionValue === 1) {
                this.stopMotion();
                this.reportStateModification();
            }

            // if action === 'MOVE', emit action value to action move flow
            if (actionValue === 1) {
                this.sActionMoveFlow.next(actionValue);
            }
            this.currentActionValue = actionValue;
        });
    }

    private adjustRotation(targetRotation: number, changefreq: number): Bluebird<void> {
        return new Bluebird((resolve, reject) => {
            this.rotationModificationTimer = Observable.timer(0, changefreq).subscribe(() => {
                if (this.physicalState.rotation > targetRotation) {
                    this.physicalState.rotation -= 1;
                } else if (this.physicalState.rotation < targetRotation) {
                    this.physicalState.rotation += 1;
                } else {
                    resolve();
                }
            });
        })
    }

    private moveJalousie(targetPosition: number, changefreq: number): Bluebird<void> {
        return new Bluebird((resolve, reject) => {
            this.positionModificationTimer = Observable.timer(0, changefreq).subscribe(() => {
                if (this.physicalState.position > targetPosition) {
                    this.physicalState.position -= 1;
                } else if (this.physicalState.position < targetPosition) {
                    this.physicalState.position += 1;
                } else {
                    resolve();
                }
            });
        })
    }

    private stopMotion() {
        if (this.positionModificationTimer) {
            this.positionModificationTimer.unsubscribe();
            this.positionModificationTimer = null;
        }
        if (this.rotationModificationTimer) {
            this.rotationModificationTimer.unsubscribe();
            this.rotationModificationTimer = null;
        }
    }

    private reportStateModification() {
        const posFeedbackUnit = this.storage.get(BACnetJalousieUnitFunctions.PositionFeedback).unit;
        posFeedbackUnit.storage.updateProperty({
            id: BACNet.Enums.PropertyId.presentValue,
            payload: new BACNet.Types.BACnetReal(this.physicalState.position)
        });

        const rotFeedbackUnit = this.storage.get(BACnetJalousieUnitFunctions.RotationFeedback).unit;
        rotFeedbackUnit.storage.updateProperty({
            id: BACNet.Enums.PropertyId.presentValue,
            payload: new BACNet.Types.BACnetReal(this.physicalState.rotation)
        });
    }
    /**
     * getConfigWithEDE - concatenates the default unit configuration with EDE
     * configuration.
     *
     * @param  {ICustomFunctionConfig} unitConfig - default unit configuration
     * @param  {IEDEUnit} edeUnit - EDE configuration
     * @return {ICustomFunctionConfig} - unit configuration
     */
    public getConfigWithEDE (unitConfig: Units.Custom.Config, edeUnit: IEDEUnit): Units.Custom.Config {
        let max: number, min: number;
        if ( PositionModificationAliases.includes(edeUnit.custUnitFn)
            || RotationModificationAliases.includes(edeUnit.custUnitFn)) {

            max = _.isNumber(edeUnit.custUnitMax) && _.isFinite(edeUnit.custUnitMax)
                ? edeUnit.custUnitMax : unitConfig.max;

            min = _.isNumber(edeUnit.custUnitMin) && _.isFinite(edeUnit.custUnitMin)
                ? edeUnit.custUnitMin : unitConfig.min;

            return { max, min };
        }
        return unitConfig;
    }
}
