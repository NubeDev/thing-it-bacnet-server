import * as _ from 'lodash';
import { Observable, BehaviorSubject } from 'rxjs';

import {
    BACnetUnitFamily,
    BACnetUnitDataFlow
} from '../../../core/enums';

import {
    IEDEUnit,
    ICustomFunctionConfig,
    ITemperatureFunction,
    IThermostatFunction,
    ISetpointFunction,
    IModeFunction,
    UnitStorageProperty,
} from '../../../core/interfaces';

import { ThermostatMetadata } from './thermostat.metadata';
import { CustomUnit } from '../custom.unit';
import { AliasMap } from '../../../core/alias/alias.map';

import * as BACNet from 'tid-bacnet-logic';
import { BACnetThermostatUnitFunctions } from '../../../core/enums';
import { AnalogValueUnit } from '../../native/analog/analog-value/analog-value.unit';
import { MultiStateValueUnit } from '../../native/multi-state/multi-state-value/multi-state-value.unit';

export class ThermostatUnit extends CustomUnit {
    public readonly className: string = 'FunctionUnit';
    public storage: AliasMap<IThermostatFunction<AnalogValueUnit|MultiStateValueUnit>>;
    private sTempFlow: BehaviorSubject<number>;

    /**
     * initUnit - inits the custom unit.
     *
     * @return {void}
     */
    public initUnit (): void {
        super.initUnit();

        this.addMetadata(ThermostatMetadata);
    }

    /**
     * startSimulation - starts the simulation logic of the "thermostat" custom unit.
     *
     * @return {void}
     */
    public startSimulation (): void {
        const setpointFeedbackFn = this.storage.get(BACnetThermostatUnitFunctions.SetpointFeedback) as ISetpointFunction<AnalogValueUnit>;
        const setpointModificationFn = this.storage.get(BACnetThermostatUnitFunctions.SetpointModification) as ISetpointFunction<AnalogValueUnit>;
        if (setpointFeedbackFn.unit && setpointModificationFn.unit) {
            this.simulateSetpoint(setpointFeedbackFn, setpointModificationFn)
        }

        const temperatureFn = this.storage.get(BACnetThermostatUnitFunctions.Temperature) as ITemperatureFunction<AnalogValueUnit>;
        if (temperatureFn.unit) {
            this.simulateTemperature(temperatureFn)
        }

        const modeFn = this.storage.get(BACnetThermostatUnitFunctions.Mode) as IModeFunction<MultiStateValueUnit>;
        if (modeFn.unit) {
            this.simulateMode(modeFn)
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
     * @param  {ITemperatureFunction<AnalogValueUnit>|ISetpointFunction<AnalogValueUnit>} unitFn - instance of a native unit
     * @return {BACNet.Types.BACnetReal} - payload of present valye property
     */
    private genStartPresentValue (unitFn: ITemperatureFunction<AnalogValueUnit>|ISetpointFunction<AnalogValueUnit>): BACNet.Types.BACnetTypeBase {
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
     * @param  {ITemperatureFunction<AnalogValueUnit>} unitFn - thermostat's temperature function
     * @return {void}
     */
    private simulateTemperature (unitFn: ITemperatureFunction<AnalogValueUnit>): void {
        const tempUnit = unitFn.unit;
        const tempConfig = unitFn.config;
        const tempStartPayload = this.genStartPresentValue(unitFn);
        tempUnit.storage.setProperty({
            id: BACNet.Enums.PropertyId.presentValue,
            payload: tempStartPayload,
        });
        this.sTempFlow = new BehaviorSubject<number>(tempStartPayload.value);

        let temperature = this.getUnitValue(tempUnit);
        Observable.timer(0, tempConfig.freq)
            .subscribe(() => {
                const setpointUnit = this.storage.get(BACnetThermostatUnitFunctions.SetpointFeedback).unit as AnalogValueUnit;
                const setpoint = this.getUnitValue(setpointUnit);
                if (_.isNil(setpoint) || temperature === setpoint) {
                    return;
                }

                if (temperature > setpoint) {
                    temperature -= 0.1;

                } else if (temperature < setpoint) {
                    temperature += 0.1;
                }
                temperature = _.round(temperature, 1);
                tempUnit.storage.setProperty({
                    id: BACNet.Enums.PropertyId.presentValue,
                    payload: new BACNet.Types.BACnetReal(temperature)
                })
                this.sTempFlow.next(temperature);

            });
    }

    /**
     * simulateSetpoint - generates start value of the setpoint,
     * gets new payload for setpointFeedback unit "Present Value" BACnet property,
     * based on the setpointModification unit payload,
     * sets new payload in setpointFeedback "Present Value" property.
     *
     * @param  {ISetpointFunction<AnalogValueUnit>} feedbackFn - thermostat's setpoint Feedback function
     * @param  {ISetpointFunction<AnalogValueUnit>} modificationFnFn - thermostat's setpoint Modification function
     * @return {void}
     */
    private simulateSetpoint(feedbackFn: ISetpointFunction<AnalogValueUnit>, modificationFn: ISetpointFunction<AnalogValueUnit>): void {
        const feedbackUnit = feedbackFn.unit;
        const feedbackConfig = feedbackFn.config;
        const modificationUnit = modificationFn.unit;
        const modificationConfig = modificationFn.config;
        modificationUnit.storage.setFlowHandler(BACnetUnitDataFlow.Update, BACNet.Enums.PropertyId.presentValue, (notif: UnitStorageProperty) => {
            modificationUnit.storage.dispatch();
            const setpointModificationPayload = notif.payload as BACNet.Types.BACnetReal;
            let setpointModificationValue = +setpointModificationPayload.getValue();
            if (setpointModificationValue > 0) {
                setpointModificationValue = Math.min(setpointModificationValue, modificationConfig.max);
            } else {
                setpointModificationValue = Math.max(setpointModificationValue, modificationConfig.min);
            }
            const currentSetpointValue = this.getUnitValue(feedbackUnit);
            let newSetpointValue = currentSetpointValue + setpointModificationValue;
            newSetpointValue = newSetpointValue > feedbackConfig.max ? feedbackConfig.max :
                newSetpointValue < feedbackConfig.min ? feedbackConfig.min : newSetpointValue;
            feedbackUnit.storage.updateProperty({
                id: BACNet.Enums.PropertyId.presentValue,
                payload: new BACNet.Types.BACnetReal(newSetpointValue)
            })
        })
        const startPayload = this.genStartPresentValue(feedbackFn);
        feedbackUnit.storage.setProperty({
            id: BACNet.Enums.PropertyId.presentValue,
            payload: startPayload,
        });
    }

    /**
     * simulateMode - gets new payload for mode unit "Present Value" BACnet property,
     * based on the difference between setpoint and temperature,
     * sets new payload in mode unit's "Present Value" property.
     *
     * @param  {ITemperatureFunction<AnalogValueUnit>} unitFn - thermostat's temperature function
     * @return {void}
     */
    private simulateMode(unitFn: IModeFunction<MultiStateValueUnit>): void {
        const modeUnit = unitFn.unit;
        const modeConfig = unitFn.config;
        const stateTextPayload = modeConfig.stateText.map( text => new BACNet.Types.BACnetCharacterString(text))
        modeUnit.storage.updateProperty({
            id: BACNet.Enums.PropertyId.stateText,
            payload: stateTextPayload
        });
        if (this.sTempFlow) {
            this.sTempFlow.subscribe((temperature) => {
                const setpointFn = this.storage.get(BACnetThermostatUnitFunctions.SetpointFeedback);
                const setpoint = this.getUnitValue(setpointFn.unit as AnalogValueUnit)
                if (setpoint > temperature) {
                    modeUnit.storage.setProperty({
                        id: BACNet.Enums.PropertyId.presentValue,
                        payload: new BACNet.Types.BACnetUnsignedInteger(2)
                    });
                } else if (setpoint < temperature) {
                    modeUnit.storage.setProperty({
                        id: BACNet.Enums.PropertyId.presentValue,
                        payload: new BACNet.Types.BACnetUnsignedInteger(1)
                    });
                }
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
    public getConfigWithEDE (unitConfig: ICustomFunctionConfig, edeUnit: IEDEUnit): ICustomFunctionConfig {
        let max: number, min: number, freq: number;
        if (edeUnit.custUnitFn === BACnetThermostatUnitFunctions.SetpointModification
            || edeUnit.custUnitFn === BACnetThermostatUnitFunctions.SetpointFeedback
            || edeUnit.custUnitFn === BACnetThermostatUnitFunctions.Temperature) {

            max = _.isNumber(edeUnit.custUnitMax) && _.isFinite(edeUnit.custUnitMax)
                ? edeUnit.custUnitMax : unitConfig.max;

            min = _.isNumber(edeUnit.custUnitMin) && _.isFinite(edeUnit.custUnitMin)
                ? edeUnit.custUnitMin : unitConfig.min;

            if (edeUnit.custUnitFn === BACnetThermostatUnitFunctions.Temperature) {

                freq = _.isNumber(edeUnit.custUnitFreq) && _.isFinite(edeUnit.custUnitFreq)
                ? edeUnit.custUnitFreq : unitConfig.freq;

                return { min, max, freq };
            }

            return { max, min };
        }
        return {};
    }
}
