import * as _ from 'lodash';

import {
    BACnetPropertyId,
    BACnetUnitFamily,
    BACnetUnitDataFlow,
} from '../../../core/bacnet/enums';

import {
    ApiError,
} from '../../../core/errors';

import {
    IBACnetObjectProperty,
} from '../../../core/bacnet/interfaces';

import { IEDEUnit } from '../../../core/interfaces';

import { AnalogMetadata } from './analog.metadata';
import { StatusFlagsMiddleUnit } from '../middles/status-flags/status-flags.middle';

import { NativeUnit } from '../native.unit';

import * as BACnetTypes from '../../../core/bacnet/types';

export class AnalogUnit extends NativeUnit {
    public readonly className: string = 'AnalogUnit';
    public readonly family: string = BACnetUnitFamily.Analog;

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);

        StatusFlagsMiddleUnit.createAndBind(this.storage);
        this.storage.addUnitStorage(AnalogMetadata);

        if (!_.isNil(edeUnit.unitCode)) {
            this.storage.setProperty({
                id: BACnetPropertyId.units,
                payload: new BACnetTypes.BACnetEnumerated(edeUnit.unitCode),
            });
        }

        if (!_.isNil(edeUnit.minPresentValue)) {
            this.storage.setProperty({
                id: BACnetPropertyId.minPresValue,
                payload: new BACnetTypes.BACnetReal(edeUnit.minPresentValue),
            });
        }

        if (!_.isNil(edeUnit.maxPresentValue)) {
            this.storage.setProperty({
                id: BACnetPropertyId.maxPresValue,
                payload: new BACnetTypes.BACnetReal(edeUnit.maxPresentValue),
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
        super.sjHandler();

        this.storage.setFlowHandler(BACnetUnitDataFlow.Set,
            [ BACnetPropertyId.maxPresValue, BACnetPropertyId.minPresValue,
                BACnetPropertyId.units ], (notif) => {
            this.storage.updateProperty(notif);
        });
    }

    /**
    * getReportedProperties - returns the reported properties for COV notification.
    *
    * @return {IBACnetObjectProperty[]}
    */
   protected getReportedProperties (): IBACnetObjectProperty[] {
       const presentValue = this.storage.getProperty(BACnetPropertyId.presentValue);
       const statusFlags = this.storage.getProperty(BACnetPropertyId.statusFlags);

       return [ presentValue, statusFlags ];
   }
}
