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

type TSjHandler = (notif: IBACnetObjectProperty) => void;

export class UnitStorage {
    /* Logging */
    public readonly className: string = 'UnitStorage';
    public logHeader: string;
    // Unit metadata
    public metadata: Map<BACnetPropIds, IBACnetObjectProperty>;
    // Subject for "set" event
    public sjSetFlow: Subject<IBACnetObjectProperty>;
    // Subject for "update" event
    public sjUpdateFlow: Subject<IBACnetObjectProperty>;
    // Subject for BACnet "CoV" event
    public sjCOV: BehaviorSubject<null>;
    // Subject handlers
    private sjHandlers: Map<BACnetPropIds, TSjHandler>;

    constructor () {
        this.sjSetFlow = new Subject();
        this.sjCOV = new BehaviorSubject(null);

        this.metadata = new Map();

        _.map(NativeMetadata, (prop) => {
            this.metadata.set(prop.id, prop);
        });
    }

    public initStorage () {
        this.metadata = new Map();
        this.sjHandlers = new Map();

        this.sjSetFlow.subscribe((notif) => {
            const sjHandler = this.sjHandlers.get(notif.id);

            if (!_.isFunction(sjHandler)) {
                return;
            }

            sjHandler(notif);
        });
    }

    public addUnitStorage (unitMetadata: IBACnetObjectProperty[]) {
        _.map(unitMetadata, (prop) => {
            this.metadata.set(prop.id, prop);
        });
    }

    public setSjHandler (propIds: BACnetPropIds|BACnetPropIds[], fn: TSjHandler) {
        let propIdArray: BACnetPropIds[] = _.isArray(propIds) ? propIds : [propIds];
        _.map(propIdArray, (propId) => {
            this.sjHandlers.set(propId, fn);
        });
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

        logger.debug(`${this.getLogHeader()} - setProperty (${BACnetPropIds[newProp.id]}):`,
            JSON.stringify(newProp));

        this.sjSetFlow.next(newProp);
    }

    /**
     * setProperty - sets the value of the unit property by property ID.
     *
     * @param  {BACnetPropIds} propId - property ID
     * @param  {IBACnetType} value - property value
     * @return {void}
     */
    public updateProperty (newProp: IBACnetObjectProperty, isEmitted: boolean = true): void {
        const prop = this.getProperty(newProp.id);

        prop.payload = newProp.payload;

        this.metadata.set(newProp.id, prop);

        logger.debug(`${this.getLogHeader()} - updateProperty (${BACnetPropIds[newProp.id]}):`,
            JSON.stringify(newProp));

        if (isEmitted) {
            this.sjUpdateFlow.next(prop);
        }
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
            return {
                id: propId,
                payload: new BACnetTypes.BACnetNull(),
            };
        }
        logger.debug(`${this.getLogHeader()} - getProperty (${BACnetPropIds[propId]}):`,
            JSON.stringify(prop));
        return _.cloneDeep(prop);
    }

    /**
     * dispatch - emits the "CoV" event.
     *
     * @return {void}
     */
    public dispatch (): void {
        this.sjCOV.next(null);
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
