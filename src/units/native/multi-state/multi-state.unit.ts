import * as _ from 'lodash';

import {
    BACnetPropertyId,
    BACnetUnitFamily,
} from '../../../core/bacnet/enums';

import {
    ApiError,
} from '../../../core/errors';

import {
    IBACnetObjectProperty,
} from '../../../core/bacnet/interfaces';

import { IEDEUnit } from '../../../core/interfaces';

import { MultiStateMetadata } from './multi-state.metadata';
import { StatusFlagsMiddleUnit } from '../middles/status-flags/status-flags.middle';

import { NativeUnit } from '../native.unit';

import * as BACnetTypes from '../../../core/bacnet/types';

export class MultiStateUnit extends NativeUnit {
    public readonly className: string = 'MultiStateUnit';
    public readonly family: string = BACnetUnitFamily.MultiState;

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);

        StatusFlagsMiddleUnit.createAndBind(this.storage);
        this.storage.addUnitStorage(MultiStateMetadata);
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
