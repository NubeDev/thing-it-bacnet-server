import * as _ from 'lodash';

import {
    BACnetPropertyId,
    BACnetBinaryPV,
    BACnetEventState,
    BACnetPolarity,
    BACnetUnitDataFlow,
} from '../../../../core/bacnet/enums';

import {
    ApiError,
} from '../../../../core/errors';

import {
    IBACnetObjectProperty,
    IBACnetTypeStatusFlags,
} from '../../../../core/bacnet/interfaces';

import { IEDEUnit } from '../../../../core/interfaces';

import { BinaryOutputMetadata } from './binary-output.metadata';

import { BinaryUnit } from '../binary.unit';
import { CommandableMiddleUnit } from '../../middles/commandable/commandable.middle';

import * as BACnetTypes from '../../../../core/bacnet/types';

export class BinaryOutputUnit extends BinaryUnit {
    public readonly className: string = 'BinaryOutputUnit';

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);

        CommandableMiddleUnit.createAndBind(this.storage);
        this.storage.addUnitStorage(BinaryOutputMetadata);

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
        const polarityProp = this.storage.getProperty(BACnetPropertyId.polarity);
        const polarity = polarityProp.payload as BACnetTypes.BACnetEnumerated;

        if (polarity.value === BACnetPolarity.Reverse) {
            const newPresentValue = _.cloneDeep(notif.payload) as BACnetTypes.BACnetEnumerated;

            switch (newPresentValue.value) {
                case BACnetBinaryPV.Active:
                    newPresentValue.value = BACnetBinaryPV.Inactive;
                    break;
                case BACnetBinaryPV.Inactive:
                    newPresentValue.value = BACnetBinaryPV.Active;
                    break;
                default:
                    newPresentValue.value = BACnetBinaryPV.Inactive;
                    break;
            }

            this.storage.updateProperty({
                id: BACnetPropertyId.presentValue,
                payload: newPresentValue,
            }, false);
        }

        this.storage.dispatch();
    }
}