import * as _ from 'lodash';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

import {
    BACnetUnitDataFlow,
} from '../core/enums';

import {
    ApiError,
} from '../core/errors';

import {
    UnitPropertyObject,
} from '../core/interfaces';

import {
    logger,
} from '../core/utils';

import * as BACNet from 'tid-bacnet-logic';

type TSjHandler = (notif: UnitPropertyObject) => void;

interface IDataFlow {
    type: BACnetUnitDataFlow;
    value: UnitPropertyObject;
}

export class UnitStorage {
    /* Logging */
    public readonly className: string = 'UnitStorage';
    public logHeader: string;
    // Unit metadata
    public metadata: Map<BACNet.Enums.PropertyId, UnitPropertyObject>;
    // Subject for data flow events
    public sjDataFlow: Subject<IDataFlow>;
    // Subject for BACnet "CoV" event
    public sjCOV: BehaviorSubject<null>;
    // Store with handlers of data flow events
    private shFlowHandlers: Map<string, TSjHandler>;

    /**
     * initStorage - inits the storage, creates the subscribtion on "set" event flow.
     *
     * @return {void}
     */
    public initStorage (): void {
        this.sjDataFlow = new Subject();
        this.sjCOV = new BehaviorSubject(null);
        this.metadata = new Map();
        this.shFlowHandlers = new Map();

        this.sjDataFlow.subscribe((notif) => {
            const sjHandler = this.getFlowHandler(notif.type, notif.value.id);

            if (!_.isFunction(sjHandler)) {
                return;
            }

            sjHandler(notif.value);
        });
    }

    /**
     * addUnitStorage - adds new unit metadata (properties) to the unit storage.
     *
     * @param  {UnitPropertyObject[]} unitMetadata - unit metadata
     * @return {void}
     */
    public addUnitStorage (unitMetadata: UnitPropertyObject[]): void {
        _.map(unitMetadata, (prop) => {
            this.metadata.set(prop.id, prop);
        });
    }

    /**
     * setFlowHandler - sets the handler for specific property on the specific flow.
     *
     * @param  {TFlowTypes} flowType - type of the flow
     * @param  {BACNet.Enums.PropertyId|BACNet.Enums.PropertyId[]} propIds - identifier of the property
     * @param  {TSjHandler} fn - handler of the flow events
     * @return {void}
     */
    public setFlowHandler (flowType: BACnetUnitDataFlow,
            propIds: BACNet.Enums.PropertyId|BACNet.Enums.PropertyId[], fn: TSjHandler): void {
        let propIdArray: BACNet.Enums.PropertyId[] = _.isArray(propIds) ? propIds : [propIds];

        _.map(propIdArray, (propId) => {
            this.shFlowHandlers.set(`${flowType}:${propId}`, fn);
        });
    }

    /**
     * getFlowHandler - finds the flow handler by flow type and property ID.
     *
     * @param  {TFlowTypes} flowType - type of the flow
     * @param  {BACNet.Enums.PropertyId|BACNet.Enums.PropertyId[]} propIds - identifier of the property
     * @return {TSjHandler}
     */
    public getFlowHandler (flowType: BACnetUnitDataFlow,
            propId: BACNet.Enums.PropertyId): TSjHandler {
        return this.shFlowHandlers.get(`${flowType}:${propId}`);
    }

    /**
     * setProperty - finds the property by "newProp.id" and emits newProp in "set" event.
     *
     * @param  {BACNet.Enums.PropertyId} propId - property ID
     * @param  {IBACnetType} value - property value
     * @return {void}
     */
    public setProperty (newProp: UnitPropertyObject,
            isWritable: boolean = true): void {
        const oldProp = this.getProperty(newProp.id);

        // if (!isWritable && !oldProp.writable) {
        //     return;
        // }

        logger.debug(`${this.getLogHeader()} - setProperty (${BACNet.Enums.PropertyId[newProp.id]}):`,
            JSON.stringify(newProp));

        this.sjDataFlow.next({ type: BACnetUnitDataFlow.Set, value: newProp });
    }

    /**
     * updateProperty - finds the property by "newProp.id", sets new payload,
     * updates the old property and emits "newProp" in "update" event flow.
     *
     * @param  {BACNet.Enums.PropertyId} newProp - property ID
     * @param  {boolean} isEmitted - emit the `update` event?
     * @return {void}
     */
    public updateProperty (newProp: UnitPropertyObject, isEmitted: boolean = true): void {
        const prop = this.getProperty(newProp.id);

        prop.payload = newProp.payload;

        this.metadata.set(newProp.id, prop);

        logger.debug(`${this.getLogHeader()} - updateProperty (${BACNet.Enums.PropertyId[newProp.id]}):`,
            JSON.stringify(newProp));

        if (isEmitted) {
            this.sjDataFlow.next({ type: BACnetUnitDataFlow.Update, value: prop });
        }
    }

    /**
     * getProperty - return the clone value of the unit property by property ID.
     *
     * @param  {BACNet.Enums.PropertyId} propId - property ID
     * @return {UnitPropertyObject}
     */
    public getProperty (propId: BACNet.Enums.PropertyId): UnitPropertyObject {
        const prop = this.metadata.get(propId);

        if (_.isNil(prop)) {
            logger.debug(`${this.getLogHeader()} - getProperty (${BACNet.Enums.PropertyId[propId]}): Empty`);
            return {
                id: propId,
                payload: new BACNet.Types.BACnetNull() ,
            };
        }
        logger.debug(`${this.getLogHeader()} - getProperty (${BACNet.Enums.PropertyId[propId]}):`,
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
