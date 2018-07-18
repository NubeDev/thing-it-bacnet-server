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

import { AnalogOutputMetadata } from './analog-output.metadata';
import { CommandableMiddleUnit } from '../../middles/commandable/commandable.middle';

import { AnalogUnit } from '../analog.unit';

import * as BACNet from 'tid-bacnet-logic';

export class AnalogOutputUnit extends AnalogUnit {
    public readonly className: string = 'AnalogOutputUnit';

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);

        CommandableMiddleUnit.createAndBind(this.storage);
        this.storage.addUnitStorage(AnalogOutputMetadata);

        if (!_.isNil(edeUnit.defPresentValue)) {
            this.storage.updateProperty({
                id: BACNet.Enums.PropertyId.relinquishDefault,
                payload: new BACNet.Types.BACnetReal(edeUnit.defPresentValue),
            });

            this.storage.updateProperty({
                id: BACNet.Enums.PropertyId.presentValue,
                payload: new BACNet.Types.BACnetReal(edeUnit.defPresentValue),
            });
        }

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

        this.storage.setFlowHandler(BACnetUnitDataFlow.Update, BACNet.Enums.PropertyId.presentValue, (notif) => {
            this.shUpdatePresentValue(notif);
        });
    }

    /**
     * shUpdatePresentValue - handles the "update" flow event of 'Present Value' property.
     * - Method emits the "CoV" event.
     *
     * @param  {UnitStorageProperty} notif - notification object for priorityArray
     * @return {void}
     */
    private shUpdatePresentValue (notif: UnitStorageProperty): void {
        this.storage.dispatch();
    }
}
