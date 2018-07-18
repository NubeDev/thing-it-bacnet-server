import * as _ from 'lodash';

import {
    BACnetUnitDataFlow,
    BACnetUnitFamily,
} from '../../../core/enums';

import {
    ApiError,
} from '../../../core/errors';

import {
    UnitStorageProperty,
} from '../../../core/interfaces';

import {
    IEDEUnit,
} from '../../../core/interfaces';

import { BinaryMetadata } from './binary.metadata';
import { StatusFlagsMiddleUnit } from '../middles/status-flags/status-flags.middle';

import { NativeUnit } from '../native.unit';

import * as BACNet from 'tid-bacnet-logic';

export class BinaryUnit extends NativeUnit {
    public readonly className: string = 'BinaryUnit';
    public readonly family: string = BACnetUnitFamily.Binary;

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);

        StatusFlagsMiddleUnit.createAndBind(this.storage);
        this.storage.addUnitStorage(BinaryMetadata);
    }

    /**
     * sjHandler - handles the changes of properties.
     *
     * @param  {UnitStorageProperty} notif - notification object
     * @return {void}
     */
    public sjHandler (): void {
        super.sjHandler();

        this.storage.setFlowHandler(BACnetUnitDataFlow.Set, BACNet.Enums.PropertyId.polarity, (notif) => {
            this.shSetPolarity(notif);
        });
    }

    /**
     * shSetPolarity - handles the changes of 'Polarity' property.
     * Method checks the "outOfService" BACnet property and if it equals "FALSE"
     * then method will change the "presentValue" BACnet property.
     *
     * @param  {UnitStorageProperty} notif - notification object for Polarity
     * @return {void}
     */
    public shSetPolarity (notif: UnitStorageProperty): void {
        const outOfServiceProp = this.storage.getProperty(BACNet.Enums.PropertyId.outOfService);
        const outOfService = outOfServiceProp.payload as BACNet.Types.BACnetBoolean;

        if (outOfService.value) {
            return;
        }

        const polarityProp = this.storage.getProperty(BACNet.Enums.PropertyId.polarity);
        const polarity = polarityProp.payload as BACNet.Types.BACnetEnumerated;
        const newPolarity = notif.payload as BACNet.Types.BACnetEnumerated;

        if (polarity.value === newPolarity.value) {
            return;
        }

        this.storage.updateProperty(notif);

        const presentValueProp = this.storage.getProperty(BACNet.Enums.PropertyId.presentValue);
        const presentValue = presentValueProp.payload as BACNet.Types.BACnetEnumerated;

        this.storage.updateProperty({
            id: BACNet.Enums.PropertyId.presentValue,
            payload: presentValue,
        });
    }

    /**
    * getReportedProperties - returns the reported properties for COV notification.
    *
    * @return {UnitStorageProperty[]}
    */
   protected getReportedProperties (): UnitStorageProperty[] {
       const presentValue = this.storage.getProperty(BACNet.Enums.PropertyId.presentValue);
       const statusFlags = this.storage.getProperty(BACNet.Enums.PropertyId.statusFlags);

       return [ presentValue, statusFlags ];
   }
}
