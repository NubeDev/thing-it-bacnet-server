import * as _ from 'lodash';

import {
    BACnetUnitFamily,
} from '../../../core/enums';

import {
    ApiError,
} from '../../../core/errors';

import {
    UnitStorageProperty,
} from '../../../core/interfaces';

import { IEDEUnit, IStateTextsUnit } from '../../../core/interfaces';

import { MultiStateMetadata } from './multi-state.metadata';
import { StatusFlagsMiddleUnit } from '../middles/status-flags/status-flags.middle';

import { NativeUnit } from '../native.unit';

import * as BACNet from 'tid-bacnet-logic';

export class MultiStateUnit extends NativeUnit {
    public readonly className: string = 'MultiStateUnit';
    public readonly family: string = BACnetUnitFamily.MultiState;

    public initUnit (edeUnit: IEDEUnit, stateTextUnits: IStateTextsUnit[]) {
        super.initUnit(edeUnit);

        StatusFlagsMiddleUnit.createAndBind(this.storage);
        this.storage.addUnitStorage(MultiStateMetadata);

        if (!_.isNil(stateTextUnits) && !_.isNil(edeUnit.stateTextRef)) {
            const stateTextUnit = stateTextUnits.find((unit) => unit.referenceNumber === edeUnit.stateTextRef);
            if (!_.isNil(stateTextUnit)) {
                const stateTextPayload = stateTextUnit.stateTextsArray.map(stateText => new BACNet.Types.BACnetCharacterString(stateText));
                this.storage.updateProperty({
                    id: BACNet.Enums.PropertyId.stateText,
                    payload: stateTextPayload
                });
            }
        }
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
