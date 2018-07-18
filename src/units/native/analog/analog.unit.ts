import * as _ from 'lodash';

import {
    BACnetUnitFamily,
    BACnetUnitDataFlow,
} from '../../../core/enums';

import {
    ApiError,
} from '../../../core/errors';

import {
    UnitPropertyObject,
} from '../../../core/interfaces';

import { IEDEUnit } from '../../../core/interfaces';

import { AnalogMetadata } from './analog.metadata';
import { StatusFlagsMiddleUnit } from '../middles/status-flags/status-flags.middle';

import { NativeUnit } from '../native.unit';

import * as BACNet from 'tid-bacnet-logic';

export class AnalogUnit extends NativeUnit {
    public readonly className: string = 'AnalogUnit';
    public readonly family: string = BACnetUnitFamily.Analog;

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);

        StatusFlagsMiddleUnit.createAndBind(this.storage);
        this.storage.addUnitStorage(AnalogMetadata);

        if (!_.isNil(edeUnit.unitCode)) {
            this.storage.setProperty({
                id: BACNet.Enums.PropertyId.units,
                payload: new BACNet.Types.BACnetEnumerated(edeUnit.unitCode),
            });
        }

        if (!_.isNil(edeUnit.minPresentValue)) {
            this.storage.setProperty({
                id: BACNet.Enums.PropertyId.minPresValue,
                payload: new BACNet.Types.BACnetReal(edeUnit.minPresentValue),
            });
        }

        if (!_.isNil(edeUnit.maxPresentValue)) {
            this.storage.setProperty({
                id: BACNet.Enums.PropertyId.maxPresValue,
                payload: new BACNet.Types.BACnetReal(edeUnit.maxPresentValue),
            });
        }

    }

    /**
     * sjHandler - handles the changes of properties.
     *
     * @param  {UnitPropertyObject} notif - notification object
     * @return {void}
     */
    public sjHandler (): void {
        super.sjHandler();

        this.storage.setFlowHandler(BACnetUnitDataFlow.Set,
            [ BACNet.Enums.PropertyId.maxPresValue, BACNet.Enums.PropertyId.minPresValue,
                BACNet.Enums.PropertyId.units ], (notif) => {
            this.storage.updateProperty(notif);
        });
    }

    /**
    * getReportedProperties - returns the reported properties for COV notification.
    *
    * @return {UnitPropertyObject[]}
    */
   protected getReportedProperties (): UnitPropertyObject[] {
       const presentValue = this.storage.getProperty(BACNet.Enums.PropertyId.presentValue);
       const statusFlags = this.storage.getProperty(BACNet.Enums.PropertyId.statusFlags);

       return [ presentValue, statusFlags ];
   }
}
