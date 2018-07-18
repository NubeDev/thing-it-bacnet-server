import * as _ from 'lodash';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

import {
    BACnetUnitDataFlow,
    BACnetUnitFamily,
} from '../../core/enums';

import {
    UnitPropertyObject
} from '../../core/interfaces';

import { IEDEUnit } from '../../core/interfaces';

import { NativeMetadata } from './native.metadata';
import { UnitStorage } from '../unit.storage';

import { MetainfoMiddleUnit } from './middles/metainfo/metainfo.middle';

import { logger } from '../../core/utils';

import * as BACNet from 'tid-bacnet-logic';

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
     * @param  {UnitPropertyObject} notif - notification object
     * @return {void}
     */
    public sjHandler (): void {
        this.storage.setFlowHandler(BACnetUnitDataFlow.Set,
            [ BACNet.Enums.PropertyId.objectIdentifier, BACNet.Enums.PropertyId.objectType,
                BACNet.Enums.PropertyId.objectName, BACNet.Enums.PropertyId.description ],
            (notif) => {
                this.storage.updateProperty(notif);
            }
        );
    }

    /**
     * subscribe - subscribes to the changes for all properties.
     *
     * @return {Observable<UnitPropertyObject>}
     */
    public subscribe (): Observable<UnitPropertyObject[]> {
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
     * @param  {BACNet.Interfaces.Type.ObjectId} objId - object identifier
     * @return {boolean}
     */
    public isBACnetObject (objId: BACNet.Interfaces.Type.ObjectId): boolean {
        const unitIdProp = this.storage.getProperty(BACNet.Enums.PropertyId.objectIdentifier);
        const unitId = unitIdProp.payload as BACNet.Types.BACnetObjectId;
        return unitId.value.type === objId.type
            && unitId.value.instance === objId.instance;
    }

    /**
     * getReportedProperties - returns the reported properties for COV notification.
     *
     * @return {UnitPropertyObject[]}
     */
    protected getReportedProperties (): UnitPropertyObject[] {
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
