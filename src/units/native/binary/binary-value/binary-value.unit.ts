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

import { IEDEUnit, IStateTextsUnit } from '../../../../core/interfaces';

import { BinaryValueMetadata } from './binary-value.metadata';

import { BinaryUnit } from '../binary.unit';
import { CommandableMiddleUnit } from '../../middles/commandable/commandable.middle';

import * as BACNet from 'tid-bacnet-logic';

export class BinaryValueUnit extends BinaryUnit {
    public readonly className: string = 'BinaryValueUnit';

    public initUnit (edeUnit: IEDEUnit, stateTextUnits: IStateTextsUnit[]) {
        super.initUnit(edeUnit, stateTextUnits);

        CommandableMiddleUnit.createAndBind(this.storage);
        this.storage.addUnitStorage(BinaryValueMetadata);

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
    public shUpdatePresentValue (notif: UnitStorageProperty): void {
        this.storage.dispatch();
    }

    /**
     * shSetPolarity - handles the changes of 'Polarity' property.
     *
     * @param  {UnitStorageProperty} notif - notification object for Polarity
     * @return {void}
     */
    public shSetPolarity (notif: UnitStorageProperty): void {
    }
}
