import * as _ from 'lodash';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

import {
    ApiError,
} from '../../core/errors';

import {
    BACnetPropertyId,
} from '../../core/bacnet/enums';

import {
    ICustomFunction,
    ICustomFunctionConfig,
    ICustomMetadata,
} from '../../core/bacnet/interfaces';

import { IEDEUnit } from '../../core/interfaces';

import { AliasMap } from '../../core/alias/alias.map';

import { NativeUnit } from '../native/native.unit';

export class CustomUnit {
    public readonly className: string = 'CustomUnit';
    public storage: AliasMap<ICustomFunction<NativeUnit>>;

    constructor () {
    }

    /**
     * setUnitFn - defines which function will be assigned the native unit
     * in custom unit.
     *
     * @param  {string} fn - function of the native unit
     * @param  {NativeUnit} unit - native unit (BACnet object)
     * @param  {IEDEUnit} edeUnit - ede configuration for unit
     * @return {void}
     */
    public setUnitFn (fn: string, unit: NativeUnit, edeUnit: IEDEUnit): void {
        const custFunc = this.storage.get(fn);

        if (!_.isNil(custFunc.unit)) {
            throw new ApiError(`${this.className} - setUnitFn: Unit is already in use!`);
        }

        const newConfig = this.getConfigWithEDE(custFunc.config, edeUnit);

        const newCustFunc: ICustomFunction<NativeUnit> = _.assign({}, custFunc, {
            unit: unit,
            config: newConfig,
        });

        this.storage.set(fn, newCustFunc);
    }

    /**
     * initUnit - inits the custom unit.
     *
     * @return {void}
     */
    public initUnit (): void {
        this.storage = new AliasMap();
    }

    /**
     * startSimulation - starts the simulation logic of the custom unit.
     *
     * @return {void}
     */
    public startSimulation (): void {
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
        let max: number = _.isNumber(edeUnit.custUnitMax) && _.isFinite(edeUnit.custUnitMax)
            ? edeUnit.custUnitMax : unitConfig.max;

        let min: number = _.isNumber(edeUnit.custUnitMin) && _.isFinite(edeUnit.custUnitMin)
            ? edeUnit.custUnitMin : unitConfig.min;

        let freq: number = _.isNumber(edeUnit.custUnitFreq) && _.isFinite(edeUnit.custUnitFreq)
            ? edeUnit.custUnitFreq : unitConfig.freq;

        return { min, max, freq };
    }

    /**
     * addMetadata - adds the metadata to alias store.
     *
     * @param  {ICustomMetadata} metadata - metadata object
     * @return {void}
     */
    public addMetadata (metadata: ICustomMetadata[]): void {
        _.map(metadata, (metaunit) => {
            this.storage.addAlias(metaunit.alias);

            const alias = _.isArray(metaunit.alias)
                ? metaunit.alias[0] : metaunit.alias;

            this.storage.set(alias, {
                unit: null,
                config: _.cloneDeep(metaunit.config),
            });
        });
    }
}
