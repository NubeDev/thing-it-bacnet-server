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
    IEDEUnit,
} from '../../core/interfaces';

import { NativeMetadata } from './native.metadata';

import * as BACnetTypes from '../../core/utils/types';

import {
    logger,
    TyperUtil,
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

        this.sjData.subscribe((notif) => {
            this.sjHandler(notif);
        });

        this.setProperty({
            id: BACnetPropIds.objectIdentifier,
            payload: new BACnetTypes.BACnetObjectId({
                type: edeUnit.objType,
                instance: edeUnit.objInst,
            }),
        });

        this.setProperty({
            id: BACnetPropIds.objectName,
            payload: new BACnetTypes.BACnetCharacterString(edeUnit.objName),
        });

        this.setProperty({
            id: BACnetPropIds.objectType,
            payload: new BACnetTypes.BACnetEnumerated(edeUnit.objType),
        });

        if (edeUnit.description) {
            this.setProperty({
                id: BACnetPropIds.description,
                payload: new BACnetTypes.BACnetCharacterString(edeUnit.description),
            });
        }

        this.dispatchCOVNotification();
    }

    /**
     * sjHandler - handles the changes of properties.
     *
     * @param  {IBACnetObjectProperty} notif - notification object
     * @return {void}
     */
    public sjHandler (notif: IBACnetObjectProperty): void {
        switch (notif.id) {
            default:
                return this.updateProperty(notif);
        }
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

        logger.debug(`${this.getLogHeader()} - setProperty (${BACnetPropIds[newProp.id]}):`
            + `${JSON.stringify(newProp)}`);

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

        this.metadata.set(newProp.id, oldProp);

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
    public getCommandablePropertyValue (): BACnetTypes.BACnetTypeBase {
        const priorityArrayProp = this.getProperty(BACnetPropIds.priorityArray);
        const priorityArray = priorityArrayProp.payload as BACnetTypes.BACnetTypeBase[];

        let priorityArrayValue: BACnetTypes.BACnetTypeBase, i: number;
        for (i = 0; i < priorityArray.length; i++) {
            if (TyperUtil.isNil(priorityArray[i])) {
                continue;
            }
            priorityArrayValue = priorityArray[i];
            break;
        }

        const priorityIndex: BACnetTypes.BACnetTypeBase = i === priorityArray.length
            ? new BACnetTypes.BACnetNull()
            : new BACnetTypes.BACnetUnsignedInteger(i);
        this.setProperty({
            id: BACnetPropIds.currentCommandPriority,
            payload: priorityIndex,
        });

        if (_.isNil(priorityArrayValue)) {
            const relinquishDefaultProp = this.getProperty(BACnetPropIds.relinquishDefault);
            const relinquishDefault = relinquishDefaultProp.payload as BACnetTypes.BACnetTypeBase;
            return relinquishDefault;
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
        const unitIdProp = this.getProperty(BACnetPropIds.objectIdentifier);
        const unitId = unitIdProp.payload as BACnetTypes.BACnetObjectId;
        return unitId.value.type === objId.type
            && unitId.value.instance === objId.instance;
    }

    /**
     * dispatchCOVNotification - dispatchs the "COV Notification" event.
     *
     * @return {void}
     */
    public dispatchCOVNotification (): void {
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
