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

import {
    logger,
} from '../../core/utils';

export class NativeUnit {
    public readonly className: string = 'NativeUnit';
    // For logging
    protected objType: number;
    protected objInst: number;
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
        this.sjCOV = new Subject();

        const nativeMetadata = _.cloneDeep(NativeMetadata);
        this.metadata = _.concat(nativeMetadata, metadata);
    }

    /**
     * initUnit - inits the unit using the EDE unit configuration.
     *
     * @param  {IEDEUnit} edeUnit - property ID
     * @return {void}
     */
    public initUnit (edeUnit: IEDEUnit): void {
        this.objType = edeUnit.objType;
        this.objInst = edeUnit.objInst

        this.setProperty(BACnetPropIds.objectIdentifier, {
            type: edeUnit.objType,
            instance: edeUnit.objInst,
        });

        this.setProperty(BACnetPropIds.objectName, {
            value: edeUnit.objName,
        });

        this.setProperty(BACnetPropIds.objectType, {
            value: edeUnit.objType,
        });

        if (edeUnit.description) {
            this.setProperty(BACnetPropIds.description, {
                value: edeUnit.description,
            });
        }

        logger.debug(`${this.getLogHeader()} - metadata: ${JSON.stringify(this.metadata)}`);
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

        logger.debug(`${this.getLogHeader()} - setProperty (${BACnetPropIds[propId]}): ${JSON.stringify(prop)}`);
    }

    /**
     * getProperty - return the clone value of the unit property by property ID.
     *
     * @param  {BACnetPropIds} propId - property ID
     * @return {IBACnetObjectProperty}
     */
    public getProperty (propId: BACnetPropIds): IBACnetObjectProperty {
        const prop = this.findProperty(propId);

        logger.debug(`${this.getLogHeader()} - getProperty (${BACnetPropIds[propId]}): ${JSON.stringify(prop)}`);
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

    /**
     * dipatchCOVNotification - dispatchs the "COV Notification" event.
     *
     * @return {void}
     */
    public dipatchCOVNotification (): void {
        const reportedProps = this.getReportedProperties();
        this.sjCOV.next(reportedProps);
    }

    /**
     * getReportedProperties - returns the reported properties for COV notification.
     *
     * @return {IBACnetObjectProperty[]}
     */
    protected getReportedProperties (): IBACnetObjectProperty[] {
        return null;
    }

    /**
     * findProperty - finds the property in the current unit and returns the
     * finded unit property.
     *
     * @param  {BACnetPropIds} propId - property ID
     * @return {IBACnetObjectProperty}
     */
    protected findProperty (propId: BACnetPropIds): IBACnetObjectProperty {
        const property = _.find(this.metadata, [ 'id', propId ]);
        return property;
    }

    /**
     * getLogHeader - returns the header for log messages.
     *
     * @return {string}
     */
    protected getLogHeader (): string {
        return `${this.className} (${this.objType}:${this.objInst})`;
    }
}
