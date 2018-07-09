import * as _ from 'lodash';

import {
    BACnetPropertyId,
    BACnetUnitDataFlow,
} from '../../../../core/bacnet/enums';

import {
    ApiError,
} from '../../../../core/errors';

import {
    IBACnetObjectProperty,
} from '../../../../core/bacnet/interfaces';

import { IEDEUnit } from '../../../../core/interfaces';

import { AnalogValueMetadata } from './analog-value.metadata';

import { AnalogUnit } from '../analog.unit';
import { CommandableMiddleUnit } from '../../middles/commandable/commandable.middle';

import * as BACnetTypes from '../../../../core/bacnet/types';

export class AnalogValueUnit extends AnalogUnit {
    public readonly className: string = 'AnalogValueUnit';

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);

        CommandableMiddleUnit.createAndBind(this.storage);
        this.storage.addUnitStorage(AnalogValueMetadata);

        if (!_.isNil(edeUnit.defPresentValue)) {
            this.storage.updateProperty({
                id: BACnetPropertyId.relinquishDefault,
                payload: new BACnetTypes.BACnetReal(edeUnit.defPresentValue),
            });

            this.storage.updateProperty({
                id: BACnetPropertyId.presentValue,
                payload: new BACnetTypes.BACnetReal(edeUnit.defPresentValue),
            });
        }

        this.storage.dispatch();
    }

    /**
     * sjHandler - handles the changes of properties.
     *
     * @param  {IBACnetObjectProperty} notif - notification object
     * @return {void}
     */
    public sjHandler (): void {
        super.sjHandler();

        this.storage.setFlowHandler(BACnetUnitDataFlow.Update, BACnetPropertyId.presentValue, (notif) => {
            this.shUpdatePresentValue(notif);
        });
    }

    /**
     * shUpdatePresentValue - handles the "update" flow event of 'Present Value' property.
     * - Method emits the "CoV" event.
     *
     * @param  {IBACnetObjectProperty} notif - notification object for priorityArray
     * @return {void}
     */
    private shUpdatePresentValue (notif: IBACnetObjectProperty): void {
        this.storage.dispatch();
    }
}
