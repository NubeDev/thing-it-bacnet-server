import * as _ from 'lodash';
import { Observable, Subscription, Subject } from 'rxjs';

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
import { logger } from '../../../core/utils';

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

    /**
     * initStateModificationWatchStream - creatas a flow whicn emits target jalousie state only when position, rotation and action move value are received,
     * inits jalousie movement, stops modification timer and reports jalousie state when movement has end
     *
     * @param  {Units.Jalousie.Position.Modification.Config} posModConf - config of the position modification function
     * @param  {Units.Jalousie.Rotation.Modification.Config} rotModConf - config of the rotation modification function
     * @return {void}
     */
    private initStateModificationWatchStream(posModConf: Units.Jalousie.Position.Modification.Config, rotModConf: Units.Jalousie.Rotation.Modification.Config) {

        // start jalousie state modification only if all three values are emited (position, rotation, action move)
        this.sStateModificationFlow = Observable.zip(
            this.sPosModFlow,
            this.sRotModFlow,
            this.sActionMoveFlow
        )
        .map(([position, rotation]) => {
            return { position, rotation }
        });
        this.sStateModificationFlow.subscribe((state) => {
            logger.debug(`Start jalousie state modification. Target state: ${state}`);
            this.adjustRotation(state.rotation, rotModConf.freq)
                .then(() => {
                    return this.moveJalousie(state.position, posModConf.freq);
                })
                .then(() => {
                    this.stopMotion();
                    logger.debug(`End jalousie state modification. Achived state: ${JSON.stringify(this.physicalState)}`);
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
     * simulatePosition - generates start value of the jalousie position,
     * checks received modification for min-max conditions,
     * sends value to position modification flow.
     *
     * @param  {PositionFeedbackFunction} feedbackFn - jalousie position Feedback function
     * @param  {PositionModificationFunction} modificationFn - jalousie position Modification function
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
     * simulateRotation - generates start value of the jalousie rotation,
     * checks received modification for min-max conditions,
     * sends value to rotation modification flow.
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

    /**
     * simulateAction - generates start value of the jalousie action state,
     * sets the pyload of action object's "stateText" property
     * validates received modification, stops jalousie if it is moving,
     * sends acton 'MOVE' value to action move flow, sets currentActionValue property.
     *
     * @param {ActionFunction} actionFn - action function of the jalousie
     * @return {void}
     */
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

    /**
     * adjustRotation - starts a timer to change simulated physical rotation value,
     * which stops when target rotation will be achived.
     *
     * @param {number} targetRotation - the value of rotation that should be achived
     * @return {Bluebird<void>}
     */
    private adjustRotation(targetRotation: number, changefreq: number): Bluebird<void> {
        return new Bluebird((resolve, reject) => {
            logger.debug(`Start jalousie rotation adjustment`);
            this.rotationModificationTimer = Observable.timer(0, changefreq).subscribe(() => {
                if (this.physicalState.rotation > targetRotation) {
                    this.physicalState.rotation -= 1;
                } else if (this.physicalState.rotation < targetRotation) {
                    this.physicalState.rotation += 1;
                }
                logger.debug(`Intermediate state: ${JSON.stringify(this.physicalState)}`);
                if (this.physicalState.rotation === targetRotation) {
                    logger.debug(`End jalousie rotation adjustment`);
                    this.rotationModificationTimer.unsubscribe();
                    resolve();
                }
            });
        })
    }

    /**
     * moveJalousie - starts a timer to change simulated physical position value,
     * which stops when target position will be achived.
     *
     * @param {number} targetPosition - the value of position that should be achived
     * @return {Bluebird<void>}
     */
    private moveJalousie(targetPosition: number, changefreq: number): Bluebird<void> {
        return new Bluebird((resolve, reject) => {
            logger.debug(`Start jalousie movement`)
            this.positionModificationTimer = Observable.timer(0, changefreq).subscribe(() => {
                if (this.physicalState.position > targetPosition) {
                    this.physicalState.position -= 1;
                } else if (this.physicalState.position < targetPosition) {
                    this.physicalState.position += 1;
                }
                logger.debug(`Intermediate state: ${JSON.stringify(this.physicalState)}`);
                if (this.physicalState.position === targetPosition) {
                    logger.debug(`End jalousie movement`);
                    this.positionModificationTimer.unsubscribe();
                    resolve();
                }
            });
        })
    }

    /**
     * stopMotion - unsubscribes & destroys position modification & rotation modification timers,
     *
     * @return {void}
     */
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

    /**
     * reportStateModification - gets position & rotation modification units,
     * saves achived "physical" state to them
     *
     * @return {void}
     */
    private reportStateModification() {
        logger.debug(`Report jalousie stat to feedback units: ${JSON.stringify(this.physicalState)}`)
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
