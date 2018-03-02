import * as _ from 'lodash';
import { Observable } from 'rxjs';

import {
    BACnetPropIds,
} from '../core/enums';

import {
    IBACnetObjectProperty,
    IBACnetModule,
} from '../core/interfaces';

import { UnitNativeBase } from '../core/bases/unit-native.base';

import { UnitModule } from './unit.module';

import { logger } from '../core/utils';

export class UnitManager {
    public className: string = 'UnitManager';
    private device: UnitNativeBase;
    private units: UnitNativeBase[];

    constructor (bnModule: IBACnetModule) {
        this.units = [];
        this.initDevice(bnModule.device);
        this.initUnits(bnModule.units);
    }

    /**
     * initDevice - creates device instance.
     *
     * @param  {number} units - object type
     * @return {void}
     */
    public initDevice (device: any): void {
        try {
            const DeviceClass = UnitModule.get('Device');
            const deviceInst: UnitNativeBase = new DeviceClass(device);
            this.device = deviceInst;
            this.units = _.concat(this.units, deviceInst);
        } catch (error) {
            logger.debug(`${this.className} - initDevice: ${error}`);
        }
    }

    /**
     * initUnits - creates unit instance, initializes the units array.
     *
     * @param  {number} units - object type
     * @return {void}
     */
    public initUnits (units: any): void {
        _.map(units, (unit: any) => {
            try {
                const UnitClass = UnitModule.get(unit.name);
                const unitInst = new UnitClass(unit);
                const nativeUnits: UnitNativeBase = unitInst.getNativeUnits();
                this.units = _.concat(this.units, nativeUnits);
            } catch (error) {
                logger.debug(`${this.className} - initUnits: ${error}`);
            }
        });
    }

    /**
     * findUnit - returns the unit by type and id.
     *
     * @param  {number} objInst - object instance
     * @param  {number} objType - object type
     * @return {UnitNativeBase}
     */
    private findUnit (objInst: number, objType: number): UnitNativeBase {
        return _.find(this.units, (unit) =>
            unit.isBACnetObject(objInst, objType));
    }

    /**
     * setUnitProperty - sets the value of the object property by property ID.
     *
     * @param  {number} objInst - object instance
     * @param  {number} objType - object type
     * @param  {BACnetPropIds} propId - property ID
     * @param  {any} values - property value
     * @return {void}
     */
    public setUnitProperty (objInst: number, objType: number,
            propId: BACnetPropIds, values: any): void {
        const unit = this.findUnit(objInst, objType);
        if (!unit) {
            return;
        }
        unit.setProperty(propId, values);
    }

    /**
     * getUnitProperty - return the clone value of the object property by property ID.
     *
     * @param  {number} objInst - object instance
     * @param  {number} objType - object type
     * @param  {BACnetPropIds} propId - property ID
     * @return {IBACnetObjectProperty}
     */
    public getUnitProperty (objInst: number, objType: number,
            propId: BACnetPropIds): IBACnetObjectProperty {
        const unit = this.findUnit(objInst, objType);
        if (!unit) {
            return null;
        }
        return unit.getProperty(propId);
    }

    /**
     * subscribeToUnit - subscribes to the changes for all object properties.
     *
     * @param  {number} objInst - object instance
     * @param  {number} objType - object type
     * @param  {BACnetPropIds} propId - property ID
     * @return {Observable<IBACnetObjectProperty>}
     */
    public subscribeToUnit (objInst: number, objType: number,
            propId: BACnetPropIds): Observable<IBACnetObjectProperty> {
        const unit = this.findUnit(objInst, objType);
        if (!unit) {
            return null;
        }
        return unit.subscribe();
    }

    /**
     * subscribeToUnitProp - subscribes to the changes of specific object property.
     *
     * @param  {number} objInst - object instance
     * @param  {number} objType - object type
     * @param  {BACnetPropIds} propId - property ID
     * @return {Observable<IBACnetObjectProperty>}
     */
    public subscribeToUnitProp (objInst: number, objType: number,
            propId: BACnetPropIds): Observable<IBACnetObjectProperty> {
        const unit = this.findUnit(objInst, objType);
        if (!unit) {
            return null;
        }
        return unit.subscribeProp(propId);
    }
}
