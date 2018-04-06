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

type TSjHandler = (notif: IBACnetObjectProperty) => boolean;

export class UnitStorage {
    /* Logging */
    public readonly className: string = 'UnitStorage';
    public logHeader: string;
    // Unit metadata
    public metadata: Map<BACnetPropIds, IBACnetObjectProperty>;
    // Unit properties subject
    public sjData: Subject<IBACnetObjectProperty>;
    // Subject handlers
    private sjHandlers: TSjHandler[];

    constructor () {
        this.sjData = new Subject();

        this.metadata = new Map();

        _.map(NativeMetadata, (prop) => {
            this.metadata.set(prop.id, prop);
        });
    }

    public initStorage () {
        this.metadata = new Map();
        this.sjHandlers = [];

        this.sjData.subscribe((notif) => {
            _.some(this.sjHandlers, (sjHandler) => !sjHandler(notif));
        });
    }

    public addUnitStorage (unitMetadata: IBACnetObjectProperty[]) {
        _.map(unitMetadata, (prop) => {
            this.metadata.set(prop.id, prop);
        });
    }

    public addSjHandler (fn: TSjHandler) {
        this.sjHandlers.push(fn);
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
     * setLogHeader - sets headers for log messages.
     *
     * @param  {string} unitName - name of the unit
     * @param  {number} objType - type of the BACnet object
     * @param  {number} objInst - instance of the BACnet object
     * @return {void}
     */
    public setLogHeader (logHeader): void {
        this.logHeader = logHeader;
    }

    /**
     * getLogHeader - returns the header for log messages.
     *
     * @return {string}
     */
    protected getLogHeader (): string {
        return `${this.className}:${this.logHeader}`;
    }
}
