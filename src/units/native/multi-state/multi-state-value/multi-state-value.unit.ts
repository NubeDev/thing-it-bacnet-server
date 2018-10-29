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

import { CommandableMiddleUnit } from '../../middles/commandable/commandable.middle';

import { IEDEUnit, IStateTextsUnit } from '../../../../core/interfaces';

import { MultiStateValueMetadata } from './multi-state-value.metadata';

import { MultiStateUnit } from '../multi-state.unit';
import * as BACNet from 'tid-bacnet-logic';

export class MultiStateValueUnit extends MultiStateUnit {
    public readonly className: string = 'MultiStateValueUnit';

    public initUnit (edeUnit: IEDEUnit, stateTextUnits: IStateTextsUnit[]) {
        super.initUnit(edeUnit, stateTextUnits);

        CommandableMiddleUnit.createAndBind(this.storage);
        this.storage.addUnitStorage(MultiStateValueMetadata);

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
