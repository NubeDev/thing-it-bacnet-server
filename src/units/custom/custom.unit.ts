import * as _ from 'lodash';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

import {
    BACnetPropIds,
} from '../../core/enums';

import {
    ApiError,
} from '../../core/errors';

import {
    IBACnetObjectProperty,
    IBACnetTypeObjectId,
    IEDEUnit,
    ICustomFunction,
} from '../../core/interfaces';

import { UnitStorage } from '../unit.storage';

import * as BACnetTypes from '../../core/utils/types';

import {
    logger,
    TyperUtil,
} from '../../core/utils';

import { NativeUnit } from '../native/native.unit';

type TFunctionName = string;

export class CustomUnit {
    public readonly className: string = 'CustomUnit';
    public storage: Map<TFunctionName, ICustomFunction<NativeUnit>> = new Map();

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
        throw new Error('Not implemented yet');
    }

    /**
     * initUnit - inits the custom unit.
     *
     * @param  {IEDEUnit} edeUnit - property ID
     * @return {void}
     */
    public initUnit (): void {
    }
}
