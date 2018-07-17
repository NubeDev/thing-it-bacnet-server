import * as _ from 'lodash';

import {
    // BACnetPropertyId,
    // BACnetBinaryPV,
    // BACnetEventState,
    // BACnetPolarity,
    BACnetUnitDataFlow,
} from '../../../../core/enums';

import {
    ApiError,
} from '../../../../core/errors';

import {
    UnitPropertyObject,
} from '../../../../core/interfaces';

import { IEDEUnit } from '../../../../core/interfaces';

import { BinaryOutputMetadata } from './binary-output.metadata';

import { BinaryUnit } from '../binary.unit';
import { CommandableMiddleUnit } from '../../middles/commandable/commandable.middle';

// import * as BACnetTypes from '../../../../core/bacnet/types';
import * as BACNet from 'tid-bacnet-logic';

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
     * @param  {UnitPropertyObject} notif - notification object
     * @return {void}
     */
    public sjHandler (): void {
        super.sjHandler();

        this.storage.setFlowHandler(BACnetUnitDataFlow.Update, BACNet.Enums.PropertyId.presentValue, (notif) => {
            this.shUpdatePresentValue(notif);
        });
    }

    /**
     * shUpdatePresentValue - handles the "update" flow event of 'Present Value' property.
     * - Method emits the "CoV" event.
     *
     * @param  {UnitPropertyObject} notif - notification object for priorityArray
     * @return {void}
     */
    private shUpdatePresentValue (notif: UnitPropertyObject): void {
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
