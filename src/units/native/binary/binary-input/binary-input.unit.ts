import * as _ from 'lodash';

import {
    BACnetUnitDataFlow,
} from '../../../../core/enums';

import {
    ApiError,
} from '../../../../core/errors';

import {
    UnitStorageProperty,
} from '../../../../core/interfaces';

import { IEDEUnit } from '../../../../core/interfaces';

import { BinaryInputMetadata } from './binary-input.metadata';

import { BinaryUnit } from '../../binary/binary.unit';

import * as BACNet from 'tid-bacnet-logic';

export class BinaryInputUnit extends BinaryUnit {
    public readonly className: string = 'BinaryInputUnit';

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);

        this.storage.addUnitStorage(BinaryInputMetadata);

        this.storage.dispatch();
    }

    /**
     * sjHandler - handles the changes of properties.
     *
     * @param  {UnitStorageProperty} notif - notification object
     * @return {void}
     */
    public sjHandler (): void {
        super.sjHandler();

        this.storage.setFlowHandler(BACnetUnitDataFlow.Set, BACNet.Enums.PropertyId.presentValue, (notif) => {
            this.shSetPresentValue(notif);
        });

        this.storage.setFlowHandler(BACnetUnitDataFlow.Update, BACNet.Enums.PropertyId.presentValue, (notif) => {
            this.shUpdatePresentValue(notif);
        });
    }

    /**
     * shSetPresentValue - handles the changes of 'Present Value' property.
     *
     * @param  {UnitStorageProperty} notif - notification object for presentValue
     * @return {void}
     */
    private shSetPresentValue (notif: UnitStorageProperty): void {
        this.storage.updateProperty(notif);
    }

    /**
     * shUpdatePresentValue - handles the "update" flow event of 'Present Value' property.
     * - Method emits the "CoV" event.
     *
     * @param  {UnitStorageProperty} notif - notification object for priorityArray
     * @return {void}
     */
    private shUpdatePresentValue (notif: UnitStorageProperty): void {
        const polarityProp = this.storage.getProperty(BACNet.Enums.PropertyId.polarity);
        const polarity = polarityProp.payload as BACNet.Types.BACnetEnumerated;

        if (polarity.value === BACNet.Enums.Polarity.Reverse) {
            const newPresentValue = _.cloneDeep(notif.payload) as BACNet.Types.BACnetEnumerated;

            switch (newPresentValue.value) {
                case BACNet.Enums.BinaryPV.Active:
                    newPresentValue.value = BACNet.Enums.BinaryPV.Inactive;
                    break;
                case BACNet.Enums.BinaryPV.Inactive:
                    newPresentValue.value = BACNet.Enums.BinaryPV.Active;
                    break;
                default:
                    newPresentValue.value = BACNet.Enums.BinaryPV.Inactive;
                    break;
            }

            this.storage.updateProperty({
                id: BACNet.Enums.PropertyId.presentValue,
                payload: newPresentValue,
            }, false);
        }

        this.storage.dispatch();
    }
}
