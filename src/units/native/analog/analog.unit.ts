import * as _ from 'lodash';

import {
    BACnetPropertyId,
    BACnetUnitFamily,
} from '../../../core/enums';

import {
    ApiError,
} from '../../../core/errors';

import {
    IBACnetObjectProperty,
    IEDEUnit,
} from '../../../core/interfaces';

import { AnalogMetadata } from './analog.metadata';
import { StatusFlagsMiddleUnit } from '../middles/status-flags/status-flags.middle';

import { NativeUnit } from '../native.unit';

import * as BACnetTypes from '../../../core/types';

export class AnalogUnit extends NativeUnit {
    public readonly className: string = 'AnalogUnit';
    public readonly family: string = BACnetUnitFamily.Analog;

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);

        StatusFlagsMiddleUnit.createAndBind(this.storage);
        this.storage.addUnitStorage(AnalogMetadata);
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
