import * as _ from 'lodash';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

import {
    BACnetPropertyId,
    BACnetUnitDataFlow,
    BACnetUnitFamily,
} from '../../core/enums';

import {
    IBACnetObjectProperty,
    IBACnetTypeObjectId,
    IEDEUnit,
} from '../../core/interfaces';

import { NativeMetadata } from './native.metadata';
import { UnitStorage } from '../unit.storage';

import { MetainfoMiddleUnit } from './middles/metainfo/metainfo.middle';

import * as BACnetTypes from '../../core/types';

import {
    logger,
    TyperUtil,
} from '../../core/utils';

export class NativeUnit {
    public readonly className: string = 'NativeUnit';
    public logHeader: string;

    public readonly family: string = BACnetUnitFamily.Native;
    // Unit storage
    public storage: UnitStorage;

    /**
     * initUnit - inits the unit using the EDE unit configuration.
     *
     * @param  {IEDEUnit} edeUnit - property ID
     * @return {void}
     */
    public initUnit (edeUnit: IEDEUnit): void {
        // Create and init unit storage
        this.storage = new UnitStorage();
        this.storage.initStorage();

        this.sjHandler();

        // Get header of the log messages
        this.logHeader = this.getLogHeader(this.className, edeUnit.objType, edeUnit.objInst);
        this.storage.setLogHeader(this.logHeader);

        // Set middle storages
        MetainfoMiddleUnit.createAndBind(this.storage, edeUnit);
        // Set unit storage
        this.storage.addUnitStorage(NativeMetadata);
    }

    /**
     * sjHandler - handles the changes of properties.
     *
     * @param  {IBACnetObjectProperty} notif - notification object
     * @return {void}
     */
    public sjHandler (): void {
        this.storage.setFlowHandler(BACnetUnitDataFlow.Set,
            [ BACnetPropertyId.objectIdentifier, BACnetPropertyId.objectType,
                BACnetPropertyId.objectName, BACnetPropertyId.description ],
            (notif) => {
                this.storage.updateProperty(notif);
            }
        );
    }

    /**
     * getCommandablePropertyValue - return the value of the commandable property.
     *
     * @return {IBACnetType}
     */
    public getCommandablePropertyValue (): BACnetTypes.BACnetTypeBase {
        const priorityArrayProp = this.storage.getProperty(BACnetPropertyId.priorityArray);
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
        this.storage.setProperty({
            id: BACnetPropertyId.currentCommandPriority,
            payload: priorityIndex,
        });

        if (_.isNil(priorityArrayValue)) {
            const relinquishDefaultProp = this.storage.getProperty(BACnetPropertyId.relinquishDefault);
            const relinquishDefault = relinquishDefaultProp.payload as BACnetTypes.BACnetTypeBase;
            priorityArrayValue = relinquishDefault;
        }
        return _.cloneDeep(priorityArrayValue);
    }

    /**
     * subscribe - subscribes to the changes for all properties.
     *
     * @return {Observable<IBACnetObjectProperty>}
     */
    public subscribe (): Observable<IBACnetObjectProperty[]> {
        return this.storage.sjCOV.map(() => {
            const reportedProps = this.getReportedProperties();
            logger.debug(`${this.logHeader} - subscribe (dispatch):`,
                `${JSON.stringify(reportedProps)}`);
            return reportedProps;
        });
    }

    /**
     * isBACnetObject - returns true if object has compatible id and type.
     *
     * @param  {IBACnetTypeObjectId} objId - object identifier
     * @return {boolean}
     */
    public isBACnetObject (objId: IBACnetTypeObjectId): boolean {
        const unitIdProp = this.storage.getProperty(BACnetPropertyId.objectIdentifier);
        const unitId = unitIdProp.payload as BACnetTypes.BACnetObjectId;
        return unitId.value.type === objId.type
            && unitId.value.instance === objId.instance;
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
    protected getLogHeader (className: string, objType: number, objInst: number): string {
        return `${className} (${objType}:${objInst})`;
    }
}
