import * as _ from 'lodash';
import { Subject, Observable } from 'rxjs';

import {
    BACnetPropIds,
} from '../../core/enums';

import {
    ApiError,
} from '../../core/errors';

import {
    INativeUnit,
    IBACnetObjectProperty,
    IBACnetTypeObjectId,
    IBACnetType,
    IEDEUnit,
    IBACnetPropertyNotification,
} from '../../core/interfaces';

import { NativeMetadata } from './native.metadata';

export class NativeUnit {
    public className: string = 'UnitNativeBase';
    // Unit metadata
    public metadata: IBACnetObjectProperty[];
    // Unit properties subject
    public sjData: Subject<IBACnetPropertyNotification>;
    public sjCOV: Subject<IBACnetObjectProperty[]>;

    constructor (edeUnit: IEDEUnit, metadata: IBACnetObjectProperty[]) {
        if (_.isNil(edeUnit.objInst)) {
            throw new ApiError(`${this.className} - constructor: Unit ID is required!`);
        }
        this.sjData = new Subject();

        const nativeMetadata = _.cloneDeep(NativeMetadata);
        this.metadata = _.concat(nativeMetadata, metadata);

        this.initUnit(edeUnit);
    }

    /**
     * initUnit - inits the unit using the EDE unit configuration.
     *
     * @param  {IEDEUnit} edeUnit - property ID
     * @return {void}
     */
    public initUnit (edeUnit: IEDEUnit): void {
        this.setProperty(BACnetPropIds.objectIdentifier, {
            type: edeUnit.objType,
            instance: edeUnit.objInst,
        });

        this.setProperty(BACnetPropIds.objectName, {
            value: edeUnit.objName,
        });
    }

    /**
     * setProperty - sets the value of the unit property by property ID.
     *
     * @param  {BACnetPropIds} propId - property ID
     * @param  {IBACnetType} value - property value
     * @return {void}
     */
    public setProperty (propId: BACnetPropIds, value: IBACnetType): void {
        const prop = this.findProperty(propId);
        const oldValue = prop.payload;
        prop.payload = value;
        this.sjData.next({
            id: propId,
            oldValue: oldValue,
            newValue: value,
        });
    }

    /**
     * getProperty - return the clone value of the unit property by property ID.
     *
     * @param  {BACnetPropIds} propId - property ID
     * @return {IBACnetObjectProperty}
     */
    public getProperty (propId: BACnetPropIds): IBACnetObjectProperty {
        const prop = this.findProperty(propId);
        return _.cloneDeep(prop);
    }

    /**
     * subscribe - subscribes to the changes for all properties.
     *
     * @return {Observable<IBACnetObjectProperty>}
     */
    public subscribe (): Observable<IBACnetObjectProperty[]> {
        return this.sjCOV.filter(Boolean);
    }

    /**
     * isBACnetObject - returns true if object has compatible id and type.
     *
     * @param  {IBACnetTypeObjectId} objId - object identifier
     * @return {boolean}
     */
    public isBACnetObject (objId: IBACnetTypeObjectId): boolean {
        const unitId = this.findProperty(BACnetPropIds.objectIdentifier);
        const unitIdPayload = unitId.payload as IBACnetTypeObjectId;
        return unitIdPayload.type === objId.type
            && unitIdPayload.instance === objId.instance;
    }

    public dipatchCOVNotification () {
        const reportedProps = this.getReportedProperties();
        this.sjCOV.next(reportedProps);
    }

    protected getReportedProperties (): IBACnetObjectProperty[] {
        return null;
    }

    protected findProperty (propId: BACnetPropIds): IBACnetObjectProperty {
        const property = _.find(this.metadata, [ 'id', propId ]);
        return property;
    }
}
