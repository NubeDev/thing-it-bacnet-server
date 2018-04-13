import * as _ from 'lodash';

import {
    BACnetPropIds,
    BACnetBinaryPV,
    BACnetEventState,
    BACnetPolarity,
} from '../../../core/enums';

import {
    ApiError,
} from '../../../core/errors';

import {
    IBACnetObjectProperty,
    IBACnetTypeStatusFlags,
    IEDEUnit,
} from '../../../core/interfaces';

import { MultiStateMetadata } from './multi-state.metadata';
import { StatusFlagsMiddleUnit } from '../middles/status-flags/status-flags.middle';

import { NativeUnit } from '../native.unit';

import * as BACnetTypes from '../../../core/utils/types';

export class MultiStateUnit extends NativeUnit {
    public readonly className: string = 'MultiStateUnit';

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
       const presentValue = this.storage.getProperty(BACnetPropIds.presentValue);
       const statusFlags = this.storage.getProperty(BACnetPropIds.statusFlags);

       return [ presentValue, statusFlags ];
   }
}
