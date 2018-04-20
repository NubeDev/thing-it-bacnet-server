import * as _ from 'lodash';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

import {
    BACnetPropIds,
    BACnetUnitDataFlow,
    BACnetUnitFamily,
} from '../../core/enums';

import {
    ApiError,
} from '../../core/errors';

import {
    IBACnetObjectProperty,
    IBACnetTypeObjectId,
    IEDEUnit,
} from '../../core/interfaces';

import { NativeMetadata } from './native.metadata';
import { UnitStorage } from '../unit.storage';

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

        this.storage.addUnitStorage(NativeMetadata);

        if (_.isNil(edeUnit.objInst)) {
            throw new ApiError(`${this.className} - constructor: Unit ID is required!`);
        }

        // Get header of the log messages
        this.logHeader = this.getLogHeader(this.className, edeUnit.objType, edeUnit.objInst);
        this.storage.setLogHeader(this.logHeader);

        // Set default props
        this.storage.setProperty({
            id: BACnetPropIds.objectIdentifier,
            payload: new BACnetTypes.BACnetObjectId({
                type: edeUnit.objType,
                instance: edeUnit.objInst,
            }),
        });

        this.storage.setProperty({
            id: BACnetPropIds.objectName,
            payload: new BACnetTypes.BACnetCharacterString(edeUnit.objName),
        });

        this.storage.setProperty({
            id: BACnetPropIds.objectType,
            payload: new BACnetTypes.BACnetEnumerated(edeUnit.objType),
        });

        if (edeUnit.description) {
            this.storage.setProperty({
                id: BACnetPropIds.description,
                payload: new BACnetTypes.BACnetCharacterString(edeUnit.description),
            });
        }
    }

    /**
     * sjHandler - handles the changes of properties.
     *
     * @param  {IBACnetObjectProperty} notif - notification object
     * @return {void}
     */
    public sjHandler (): void {
        this.storage.setFlowHandler(BACnetUnitDataFlow.Set,
            [ BACnetPropIds.objectIdentifier, BACnetPropIds.objectType,
                BACnetPropIds.objectName, BACnetPropIds.description ],
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
        const priorityArrayProp = this.storage.getProperty(BACnetPropIds.priorityArray);
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
            id: BACnetPropIds.currentCommandPriority,
            payload: priorityIndex,
        });

        if (_.isNil(priorityArrayValue)) {
            const relinquishDefaultProp = this.storage.getProperty(BACnetPropIds.relinquishDefault);
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
        const unitIdProp = this.storage.getProperty(BACnetPropIds.objectIdentifier);
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
