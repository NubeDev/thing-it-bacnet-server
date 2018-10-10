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
    LightMetadata,
    LevelFeedbackAliases,
    LevelModificationAliases,
    StateFeedbackAliases,
    StateModificationAliases
} from './light.metadata';
import { CustomUnit } from '../custom.unit';
import { AliasMap } from '../../../core/alias/alias.map';

import * as BACNet from 'tid-bacnet-logic';
import { BACnetLightUnitFunctions } from '../../../core/enums';
import { AnalogValueUnit } from '../../native/analog/analog-value/analog-value.unit';
import { MultiStateValueUnit } from '../../native/multi-state/multi-state-value/multi-state-value.unit';

type LevelFunction = Units.Light.Level.Function<AnalogValueUnit>;
type StateFunction = Units.Light.State.Function<AnalogValueUnit>;

export class ThermostatUnit extends CustomUnit {
    public readonly className: string = 'LightUnit';
    public storage: AliasMap<LevelFunction|StateFunction>;
    private sLevelFlow: BehaviorSubject<number>;

    /**
     * initUnit - inits the custom unit.
     *
     * @return {void}
     */
    public initUnit (): void {
        super.initUnit();

        this.addMetadata(LightMetadata);
    }

    /**
     * startSimulation - starts the simulation logic of the "thermostat" custom unit.
     *
     * @return {void}
     */
    public startSimulation (): void {
        const levelFeedbackFn = this.storage.get(BACnetLightUnitFunctions.LevelFeedback) as LevelFunction;
        const levelModificationFn = this.storage.get(BACnetLightUnitFunctions.LevelModification) as LevelFunction;
        if (levelFeedbackFn.unit && levelModificationFn.unit) {
            this.simulateLevel(levelFeedbackFn, levelModificationFn)
        }

        const stateFeedbackFn = this.storage.get(BACnetLightUnitFunctions.StateFeedback) as StateFunction;
        const stateModificationFn = this.storage.get(BACnetLightUnitFunctions.StateModification) as StateFunction;
        if (stateFeedbackFn.unit && stateModificationFn.unit) {
            this.simulateState(stateFeedbackFn, stateModificationFn)
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
     * @param  {LevelFunction} unitFn - unit function
     * @return {BACNet.Types.BACnetReal} - payload of present value property
     */
    private genStartPresentValue (unitFn: LevelFunction): BACNet.Types.BACnetReal {
        const config = unitFn.config;
        let value = config.min + (config.max - config.min) / 2;
        value = _.round(value, 1)
        return new BACNet.Types.BACnetReal(value);
    }

    /**
     * simulateTemperature - gets new payload for temperature unit "Present Value" BACnet property,
     * creates the periodic timer to update the payload of the "Present Value",
     * sets new payload in "Present Value" property.
     *
     * @param  {TemperatureFunction} unitFn - thermostat's temperature function
     * @return {void}
     */
    private simulateTemperature (unitFn: LevelFunction): void {
        // const tempUnit = unitFn.unit;
        // const tempConfig = unitFn.config;
        // const tempStartPayload = this.genStartPresentValue(unitFn);
        // tempUnit.storage.setProperty({
        //     id: BACNet.Enums.PropertyId.presentValue,
        //     payload: tempStartPayload,
        // });
        // this.sTempFlow = new BehaviorSubject<number>(tempStartPayload.value);

        // let temperature = this.getUnitValue(tempUnit);
        // Observable.timer(0, tempConfig.freq)
        //     .subscribe(() => {
        //         const setpointUnit = this.storage.get(BACnetLightUnitFunctions.SetpointFeedback).unit as AnalogValueUnit;
        //         const setpoint = this.getUnitValue(setpointUnit);
        //         if (_.isNil(setpoint) || temperature === setpoint) {
        //             return;
        //         }

        //         if (temperature > setpoint) {
        //             temperature -= 0.1;

        //         } else if (temperature < setpoint) {
        //             temperature += 0.1;
        //         }
        //         temperature = _.round(temperature, 1);
        //         tempUnit.storage.setProperty({
        //             id: BACNet.Enums.PropertyId.presentValue,
        //             payload: new BACNet.Types.BACnetReal(temperature)
        //         });
        //         this.sTempFlow.next(temperature);

        //     });
    }

    /**
     * simulateSetpoint - generates start value of the setpoint,
     * gets new payload for setpointFeedback unit "Present Value" BACnet property,
     * based on the setpointModification unit payload,
     * sets new payload in setpointFeedback "Present Value" property.
     *
     * @param  {LevelFunction} feedbackFn - thermostat's setpoint Feedback function
     * @param  {LevelFunction} modificationFnFn - thermostat's setpoint Modification function
     * @return {void}
     */
    private simulateLevel(feedbackFn: LevelFunction, modificationFn: LevelFunction): void {
        const feedbackUnit = feedbackFn.unit;
        const feedbackConfig = feedbackFn.config;
        const modificationUnit = modificationFn.unit;
        const modificationConfig = modificationFn.config;
        modificationUnit.storage.setFlowHandler(BACnetUnitDataFlow.Update, BACNet.Enums.PropertyId.presentValue, (notif: UnitStorageProperty) => {
            modificationUnit.storage.dispatch();
            const levelModificationPayload = notif.payload as BACNet.Types.BACnetReal;
            let levelModificationValue = +levelModificationPayload.getValue();

            levelModificationValue = levelModificationValue > modificationConfig.max ? modificationConfig.max :
            levelModificationValue < modificationConfig.min ? modificationConfig.min : levelModificationValue;

            feedbackUnit.storage.updateProperty({
                id: BACNet.Enums.PropertyId.presentValue,
                payload: new BACNet.Types.BACnetReal(levelModificationValue)
            });
            this.sLevelFlow.next(levelModificationValue)
        });
        const startPayload = this.genStartPresentValue(feedbackFn);
        feedbackUnit.storage.setProperty({
            id: BACNet.Enums.PropertyId.presentValue,
            payload: startPayload,
        });
    }

    /**
     * simulateMode - sets "stateText" BACNet property to mode unit,
     * gets new payload for mode unit "Present Value" BACnet property,
     * based on the difference between setpoint and temperature,
     * sets new payload in mode unit's "Present Value" property.
     *
     * @param  {ModeFunction} unitFn - thermostat's temperature function
     * @return {void}
     */
    private simulateState(feedbackFn: StateFunction, modificationFn: StateFunction): void {
        const feedbackUnit = feedbackFn.unit;
        const feedbackConfig = feedbackFn.config;
        const modificationUnit = modificationFn.unit;
        const modificationConfig = modificationFn.config;
        const stateTextPayload = feedbackConfig.stateText.map( text => new BACNet.Types.BACnetCharacterString(text));
        feedbackUnit.storage.updateProperty({
            id: BACNet.Enums.PropertyId.stateText,
            payload: stateTextPayload
        });

        modificationUnit.storage.setFlowHandler(BACnetUnitDataFlow.Update, BACNet.Enums.PropertyId.presentValue, (notif: UnitStorageProperty) => {
            modificationUnit.storage.dispatch();
            const statePayload = notif.payload as BACNet.Types.BACnetReal;
            let statePrValue = +statePayload.getValue();

            if (statePrValue > 0 && statePrValue <= modificationConfig.stateText.length) {
                feedbackUnit.storage.updateProperty({
                    id: BACNet.Enums.PropertyId.presentValue,
                    payload: new BACNet.Types.BACnetReal(statePrValue)
                })
            }
        });
        let statePresentValue = 1;
        feedbackUnit.storage.updateProperty({
            id: BACNet.Enums.PropertyId.presentValue,
            payload: new BACNet.Types.BACnetUnsignedInteger(statePresentValue),
        });
        if (this.sLevelFlow) {
            this.sLevelFlow.subscribe((level) => {
                let newStatePrValue = null;
                if (level > 0) {
                    newStatePrValue = 1;
                } else if (level === 0 ) {
                    newStatePrValue = 2;
                } else {
                    return;
                }
                if (newStatePrValue === statePresentValue) {
                    return;
                }
                statePresentValue = newStatePrValue;
                feedbackUnit.storage.updateProperty({
                    id: BACNet.Enums.PropertyId.presentValue,
                    payload: new BACNet.Types.BACnetUnsignedInteger(statePresentValue)
                });
            })
        }
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
        let max: number, min: number, freq: number;
        if ( LevelFeedbackAliases.includes(edeUnit.custUnitFn)
            || LevelModificationAliases.includes(edeUnit.custUnitFn)) {

            max = _.isNumber(edeUnit.custUnitMax) && _.isFinite(edeUnit.custUnitMax)
                ? edeUnit.custUnitMax : unitConfig.max;

            min = _.isNumber(edeUnit.custUnitMin) && _.isFinite(edeUnit.custUnitMin)
                ? edeUnit.custUnitMin : unitConfig.min;

            return { max, min };
        }
        return unitConfig;
    }
}
