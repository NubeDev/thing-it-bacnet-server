import * as _ from 'lodash';
import { Observable } from 'rxjs';

import {
    BACnetPropIds,
} from '../core/enums';

import {
    IBACnetObjectProperty,
} from '../core/interfaces';

import { UnitBase } from '../core/bases/unit.base';
import { UnitNativeBase } from '../core/bases/unit-native.base';

import { DeviceMetadata } from './device.metadata';

import { UnitModule } from './unit.module';

import { logger } from '../core/utils';

export class DeviceUnit extends UnitBase {
    public className: string = 'DeviceUnit';
    public metadata: any;
    private units: UnitNativeBase[];

    constructor (bnModule: any) {
        super();
        this.metadata = _.cloneDeep(DeviceMetadata);
        this.setProps(bnModule.config);
        this.initUnits(bnModule.units);
    }

    /**
     * initUnits - creates unit instance, initializes the units array.
     *
     * @param  {number} units - object type
     * @return {void}
     */
    public initUnits (units: any[]): void {
        this.units = [];
        _.map(units, (unit) => {
            try {
                const UnitClass = UnitModule.get(unit.name);
                const unitInst = new UnitClass(unit);
                const nativeUnits: UnitNativeBase = unitInst.getNativeUnits();
                this.units = _.concat(this.units, nativeUnits);
            } catch (error) {
                logger.debug(`${this.className} - initDevice: Unit Class is not found!`);
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
     * subscribeProp - subscribes to the changes of specific object property.
     *
     * @param  {number} objInst - object instance
     * @param  {number} objType - object type
     * @param  {BACnetPropIds} propId - property ID
     * @return {Observable<IBACnetObjectProperty>}
     */
    public subscribeProp (objInst: number, objType: number,
            propId: BACnetPropIds): Observable<IBACnetObjectProperty> {
        const unit = this.findUnit(objInst, objType);
        if (!unit) {
            return null;
        }
        return unit.subscribeProp(propId);
    }
}
