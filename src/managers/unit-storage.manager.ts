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
} from '../core/types';

import {
    ApiError,
} from '../core/errors';

import {
    NativeModule,
} from '../units/native/native.module';

import {
    NativeUnit,
} from '../units/native/native.unit';

type NativeUnitToken = string;

export class UnitStorageManager {
    public readonly className: string = 'UnitStorageManager';
    private nativeUnits: Map<NativeUnitToken, NativeUnit>;
    private device: NativeUnit;

    constructor () {
        this.nativeUnits = new Map();
    }

    /**
     * initUnits - creates unit instances and initializes the units storage.
     *
     * @param  {IEDEUnit[]} edeUnits - EDE configuration of units
     * @return {void}
     */
    public initUnits (edeUnits: IEDEUnit[]): void {
        if (!edeUnits.length) {
            throw new ApiError('UnitStorageManager - initUnits: Unit array is empty!');
        }

        _.map(edeUnits, (edeUnit) => {
            const nativeUnit = this.initNativeUnit(edeUnit);
        });

        const deviceToken = this.getUnitToken(BACnetObjTypes.Device, edeUnits[0].deviceInst);
        const device = this.nativeUnits.get(deviceToken);
        this.device = device;
    }

    /**
     * initNativeUnit - creates the instance of native unit by EDE unit
     * configuration, sets the native unit to internal unit storage.
     *
     * @param  {IEDEUnit} edeUnit - EDE unit configuration
     * @return {NativeUnit} - instance of the native unit
     */
    private initNativeUnit (edeUnit: IEDEUnit): NativeUnit {
        // Get name of the native unit
        const objType = BACnetObjTypes[edeUnit.objType];
        // Get token of the native unit
        const unitToken = this.getUnitToken(edeUnit.objType, edeUnit.objInst);

        let unit: NativeUnit = null;
        try {
            let UnitClass = NativeModule.get(objType);

            if (!UnitClass) {
                logger.debug(`${this.className} - initNativeUnit: ${objType} (${unitToken}) - Use "Noop" stub unit`);
                UnitClass = NativeModule.get('Noop');
            }

            unit = new UnitClass(edeUnit);
            unit.initUnit(edeUnit);

            this.nativeUnits.set(unitToken, unit);
        } catch (error) {
            logger.debug(`${this.className} - initNativeUnit: ${objType} (${unitToken})`, error);
        }

        return unit;
    }

    /**
     * getUnitToken - returns the storage identifier (token) by the BACnet object
     * type and the BACnet object instance.
     *
     * @param  {number} objType - object type
     * @param  {number} objInst - object identifier
     * @return {NativeUnitToken}
     */
    public getUnitToken (objType: number, objInst: number): NativeUnitToken {
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
        const unitToken = this.getUnitToken(objIdValue.type, objIdValue.instance);
        return this.nativeUnits.get(unitToken);
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
        unit.storage.setProperty(prop, false);
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
        return unit.storage.getProperty(propId);
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
