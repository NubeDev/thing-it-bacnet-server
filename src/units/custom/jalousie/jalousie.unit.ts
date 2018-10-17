import * as _ from 'lodash';
import { Observable, BehaviorSubject } from 'rxjs';

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
    private sPositionFlow: BehaviorSubject<number>;

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
     * @param  {PositionFunction} feedbackFn - thermostat's setpoint Feedback function
     * @param  {PositionFunction} modificationFn - thermostat's setpoint Modification function
     * @return {void}
     */
    private simulatePosition(feedbackFn: PositionFeedbackFunction, modificationFn: PositionModificationFunction): void {
        // const feedbackUnit = feedbackFn.unit;
        // const modificationUnit = modificationFn.unit;
        // const modificationConfig = modificationFn.config;
        // modificationUnit.storage.setFlowHandler(BACnetUnitDataFlow.Update, BACNet.Enums.PropertyId.presentValue, (notif: UnitStorageProperty) => {
        //     modificationUnit.storage.dispatch();
        //     const levelModificationPayload = notif.payload as BACNet.Types.BACnetReal;
        //     let levelModificationValue = +levelModificationPayload.getValue();

        //     if (levelModificationValue > modificationConfig.max) {
        //         levelModificationValue =  modificationConfig.max;
        //     }

        //     if (levelModificationValue < modificationConfig.min) {
        //         levelModificationValue =  modificationConfig.min;
        //     }

        //     feedbackUnit.storage.updateProperty({
        //         id: BACNet.Enums.PropertyId.presentValue,
        //         payload: new BACNet.Types.BACnetReal(levelModificationValue)
        //     });
        //     this.sPositionFlow.next(levelModificationValue)
        // });
        // const startPayload = this.genStartPresentValue(feedbackFn);
        // feedbackUnit.storage.setProperty({
        //     id: BACNet.Enums.PropertyId.presentValue,
        //     payload: startPayload,
        // });
        // this.sPositionFlow = new BehaviorSubject(startPayload.value);
        throw new Error('Not implemented yet!');
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
        // const feedbackUnit = feedbackFn.unit;
        // const feedbackConfig = feedbackFn.config;
        // const modificationUnit = modificationFn.unit;
        // const modificationConfig = modificationFn.config;
        // const stateTextPayload = feedbackConfig.stateText.map( text => new BACNet.Types.BACnetCharacterString(text));
        // feedbackUnit.storage.updateProperty({
        //     id: BACNet.Enums.PropertyId.stateText,
        //     payload: stateTextPayload
        // });

        // modificationUnit.storage.setFlowHandler(BACnetUnitDataFlow.Update, BACNet.Enums.PropertyId.presentValue, (notif: UnitStorageProperty) => {
        //     modificationUnit.storage.dispatch();
        //     const statePayload = notif.payload as BACNet.Types.BACnetReal;
        //     let statePrValue = +statePayload.getValue();

        //     if (statePrValue > 0 && statePrValue <= modificationConfig.stateText.length) {
        //         feedbackUnit.storage.updateProperty({
        //             id: BACNet.Enums.PropertyId.presentValue,
        //             payload: new BACNet.Types.BACnetReal(statePrValue)
        //         })
        //     }
        // });
        // let statePresentValue = 1;

        // // setting the start value of state feedback unit
        // feedbackUnit.storage.updateProperty({
        //     id: BACNet.Enums.PropertyId.presentValue,
        //     payload: new BACNet.Types.BACnetUnsignedInteger(statePresentValue),
        // });

        // if (this.sPositionFlow) {
        //     this.sPositionFlow.subscribe((level) => {
        //         let newRotationPrValue = null;

        //         if (level > 0) {
        //             newRotationPrValue = 1;
        //         } else if (level === 0 ) {
        //             newRotationPrValue = 2;
        //         } else {
        //             return;
        //         }
        //         if (newRotationPrValue === statePresentValue) {
        //             return;
        //         }
        //         statePresentValue = newRotationPrValue;
        //         feedbackUnit.storage.updateProperty({
        //             id: BACNet.Enums.PropertyId.presentValue,
        //             payload: new BACNet.Types.BACnetUnsignedInteger(statePresentValue)
        //         });
        //     })
        // }
        throw new Error('Not implemented yet!');
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
