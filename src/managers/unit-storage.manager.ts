import * as _ from 'lodash';
import * as Bluebird from 'bluebird';
import { Observable } from 'rxjs';

import {
    IEDEUnit,
    IBACnetObjectProperty,
} from '../core/interfaces';

import {
    logger,
} from '../core/utils';

import {
    BACnetObjTypes,
    BACnetPropIds,
} from '../core/enums';

import {
    BACnetObjectId,
} from '../core/utils/types';

import {
    ApiError,
} from '../core/errors';

import {
    NativeModule,
} from '../units/native/native.module';

import {
    NativeUnit,
} from '../units/native/native.unit';

export class UnitStorageManager {
    public readonly className: string = 'UnitStorageManager';
    private units: Map<string, NativeUnit>;
    private device: NativeUnit;

    constructor () {
        this.units = new Map();
    }

    /**
     * initUnits - creates unit instance, initializes the units array.
     *
     * @param  {number} units - object type
     * @return {void}
     */
    public initUnits (units: IEDEUnit[]): void {
        if (!units.length) {
            throw new ApiError('UnitStorageManager - initUnits: Unit array is empty!');
        }

        _.map(units, (unit) => {
            const objType = BACnetObjTypes[unit.objType];
            const objId = this.getObjId(unit.objType, unit.objInst);

            try {
                let UnitClass = NativeModule.get(objType);
                if (!UnitClass) {
                    logger.debug(`${this.className} - initUnits: ${objType} (${objId}) - Use "Noop" stub unit`);
                    UnitClass = NativeModule.get('Noop');
                }
                const unitInst: NativeUnit = new UnitClass(unit);
                unitInst.initUnit(unit);
                this.units.set(objId, unitInst);
            } catch (error) {
                logger.debug(`${this.className} - initUnits: ${objType} (${objId})`, error);
            }
        });

        const devId = this.getObjId(BACnetObjTypes.Device, units[0].deviceInst);
        const device = this.units.get(devId);
        this.device = device;
    }

    /**
     * getObjId - returns the storage identifier by the object type and
     * object instance.
     *
     * @param  {number} objType - object type
     * @param  {number} objInst - object identifier
     * @return {string}
     */
    public getObjId (objType: number, objInst: number): string {
        return `${objType}:${objInst}`;
    }


    /**
     * getDevice - returns the current device.
     *
     * @return {NativeUnit}
     */
    public getDevice(): NativeUnit {
        return this.device;
    }

    /**
     * findUnit - returns the unit by type and id.
     *
     * @param  {number} objInst - object instance
     * @param  {number} objType - object type
     * @return {NativeUnit}
     */
    public getUnit (objId: BACnetObjectId): NativeUnit {
        const objIdValue = objId.getValue();
        const objIdKey = this.getObjId(objIdValue.type, objIdValue.instance);
        return this.units.get(objIdKey);
    }

    /**
     * setUnitProperty - sets the value of the object property by property ID.
     *
     * @param  {IBACnetTypeObjectId} objId - object identifier
     * @param  {BACnetPropIds} propId - property ID
     * @param  {} value - property value
     * @return {void}
     */
    public setUnitProperty (objId: BACnetObjectId,
            prop: IBACnetObjectProperty): void {
        const unit = this.getUnit(objId);
        if (!unit) {
            return;
        }
        unit.setProperty(prop, false);
    }

    /**
     * getUnitProperty - return the clone value of the object property by property ID.
     *
     * @param  {IBACnetTypeObjectId} objId - object identifier
     * @param  {BACnetPropIds} propId - property ID
     * @return {IBACnetObjectProperty}
     */
    public getUnitProperty (objId: BACnetObjectId,
            propId: BACnetPropIds): IBACnetObjectProperty {
        const unit = this.getUnit(objId);
        if (!unit) {
            return null;
        }
        return unit.getProperty(propId);
    }

    /**
     * subscribeToUnit - subscribes to the changes for all object properties.
     *
     * @param  {IBACnetTypeObjectId} objId - object identifier
     * @return {Observable<IBACnetObjectProperty>}
     */
    public subscribeToUnit (objId: BACnetObjectId): Observable<IBACnetObjectProperty[]> {
        const unit = this.getUnit(objId);
        if (!unit) {
            return null;
        }
        return unit.subscribe();
    }
}
