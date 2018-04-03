import * as _ from 'lodash';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

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
    IBACnetTypeUnsignedInt,
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
    public metadata: Map<BACnetPropIds, IBACnetObjectProperty>;
    // Unit properties subject
    public sjData: Subject<IBACnetObjectProperty>;
    public sjCOV: BehaviorSubject<IBACnetObjectProperty[]>;

    constructor (edeUnit: IEDEUnit, unitMetadata: IBACnetObjectProperty[]) {
        if (_.isNil(edeUnit.objInst)) {
            throw new ApiError(`${this.className} - constructor: Unit ID is required!`);
        }
        this.sjData = new Subject();
        this.sjCOV = new BehaviorSubject(null);

        this.metadata = new Map();
        _.map(NativeMetadata, (prop) => {
            this.metadata.set(prop.id, prop);
        });
        _.map(unitMetadata, (prop) => {
            this.metadata.set(prop.id, prop);
        });
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

        this.setProperty({
            id: BACnetPropIds.objectIdentifier,
            payload: {
                type: edeUnit.objType,
                instance: edeUnit.objInst,
            },
        });

        this.setProperty({
            id: BACnetPropIds.objectName,
            payload: {
                value: edeUnit.objName,
            },
        });

        this.setProperty({
            id: BACnetPropIds.objectType,
            payload: {
                value: edeUnit.objType,
            },
        });

        if (edeUnit.description) {
            this.setProperty({
                id: BACnetPropIds.description,
                payload: {
                    value: edeUnit.description,
                },
            });
        }

        const reportedProps = this.getReportedProperties();
        this.sjCOV.next(reportedProps);

        logger.debug(`${this.getLogHeader()} - metadata: ${JSON.stringify(this.metadata)}`);
    }

    /**
     * setProperty - sets the value of the unit property by property ID.
     *
     * @param  {BACnetPropIds} propId - property ID
     * @param  {IBACnetType} value - property value
     * @return {void}
     */
    public setProperty (newProp: IBACnetObjectProperty,
            isWritable: boolean = true): void {
        const oldProp = this.getProperty(newProp.id);

        if (!isWritable && !oldProp.writable) {
            return;
        }

        this.sjData.next(newProp);
    }

    /**
     * setProperty - sets the value of the unit property by property ID.
     *
     * @param  {BACnetPropIds} propId - property ID
     * @param  {IBACnetType} value - property value
     * @return {void}
     */
    public updateProperty (newProp: IBACnetObjectProperty): void {
        const oldProp = this.getProperty(newProp.id);

        oldProp.payload = newProp.payload;

        logger.debug(`${this.getLogHeader()} - updateProperty (${BACnetPropIds[newProp.id]}):`
            + `${JSON.stringify(newProp)}`);
    }

    /**
     * getProperty - return the clone value of the unit property by property ID.
     *
     * @param  {BACnetPropIds} propId - property ID
     * @return {IBACnetObjectProperty}
     */
    public getProperty (propId: BACnetPropIds): IBACnetObjectProperty {
        const prop = this.metadata.get(propId);

        if (_.isNil(prop)) {
            logger.debug(`${this.getLogHeader()} - getProperty (${BACnetPropIds[propId]}): Empty`);
            return null;
        }
        logger.debug(`${this.getLogHeader()} - getProperty (${BACnetPropIds[propId]}):`
            + `${JSON.stringify(prop)}`);
        return _.cloneDeep(prop);
    }

    /**
     * getCommandablePropertyValue - return the value of the commandable property.
     *
     * @return {IBACnetType}
     */
    public getCommandablePropertyValue (): IBACnetType {
        const priorityArray = this.metadata.get(BACnetPropIds.priorityArray);
        const priorityArrayPayload = priorityArray.payload as IBACnetType[];

        let priorityArrayValue: IBACnetType, i: number;
        for (i = 0; i < priorityArrayPayload.length; i++) {
            if (_.isNull((<any>priorityArrayPayload[i]).value)) {
                continue;
            }
            priorityArrayValue = priorityArrayPayload[i];
            break;
        }

        const priorityIndex: IBACnetType = i === priorityArrayPayload.length
            ? { value: null } : { value: i };
        this.setProperty({
            id: BACnetPropIds.currentCommandPriority,
            payload: priorityIndex,
        });

        if (_.isNil(priorityArrayValue)) {
            const relinquishDefault = this.metadata.get(BACnetPropIds.relinquishDefault);
            const relinquishDefaultPayload = relinquishDefault.payload as IBACnetType;
            return relinquishDefaultPayload;
        }
        return priorityArrayValue;
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
        const unitId = this.getProperty(BACnetPropIds.objectIdentifier);
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
     * getLogHeader - returns the header for log messages.
     *
     * @return {string}
     */
    protected getLogHeader (): string {
        return `${this.className} (${this.objType}:${this.objInst})`;
    }
}
