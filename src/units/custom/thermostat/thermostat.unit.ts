import * as _ from 'lodash';
import { Observable } from 'rxjs';

import {
    BACnetUnitFamily,
} from '../../../core/enums';

import {
    IEDEUnit,
    ICustomFunctionConfig,
    ITemperatureFunction,
    IThermostatFunction,
    ISetpointFunction,
} from '../../../core/interfaces';

import { ThermostatMetadata } from './thermostat.metadata';
import { CustomUnit } from '../custom.unit';
import { NativeUnit } from '../../native/native.unit';
import { AliasMap } from '../../../core/alias/alias.map';

import * as BACNet from 'tid-bacnet-logic';
import { BACnetThermostatUnitFunctions } from '../../../core/enums';

export class FunctionUnit extends CustomUnit {
    public readonly className: string = 'FunctionUnit';
    public storage: AliasMap<IThermostatFunction<NativeUnit>>;

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
     * startSimulation - starts the simulation logic of the "function" custom unit.
     *
     * @return {void}
     */
    public startSimulation (): void {
        const setpointFn = this.storage.get(BACnetThermostatUnitFunctions.Setpoint) as ISetpointFunction<NativeUnit>;
        if (setpointFn.unit) {
            this.simulateSetpoint(setpointFn)
        }

        const temperatureFn = this.storage.get(BACnetThermostatUnitFunctions.Temperature) as ITemperatureFunction<NativeUnit>;
        if (setpointFn.unit) {
            this.simulateTemperature(temperatureFn)
        }
    }


    /**
     * genPayloadOfPresentValue - generates payload for "Present Value" BACnet property.
     * Method uses PRNG from arguments to get values for "Present Value" property.
     *
     * @param  {PRNG.PRNGBase} prng - instance of a PRNG
     * @param  {NativeUnit} unit - instance of a native unit
     * @return {void}
     */
    private genPayloadOfPresentValue (unit: NativeUnit): BACNet.Types.BACnetTypeBase {
        throw new Error ('Not implemented yet');
    }

    /**
     * simulateDistribution - gets new payload for "Present Value" BACnet property,
     * creates the periodic timer to update the payload of the "Present Value",
     * sets new payload in "Present Value" property.
     *
     * @param  {NativeUnit} unit - instance of a native unit
     * @return {void}
     */
    private simulateTemperature (unitFn: ITemperatureFunction<NativeUnit>): void {
        const unit = unitFn.unit;
        const config = unitFn.config;

        Observable.timer(0, config.freq)
            .subscribe(() => {
                let payload = this.genPayloadOfPresentValue(unit);

                if (_.isNil(payload)) {
                    return;
                }

                unit.storage.setProperty({
                    id: BACNet.Enums.PropertyId.presentValue,
                    payload: payload,
                });
            });
    }

    private simulateSetpoint(unitFn: ISetpointFunction<NativeUnit>): void {
        const unit = unitFn.unit;
        const config = unitFn.config;
        throw new Error ('Not implemented yet');
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
        if (edeUnit.custUnitFn === BACnetThermostatUnitFunctions.Setpoint
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

    }
}
