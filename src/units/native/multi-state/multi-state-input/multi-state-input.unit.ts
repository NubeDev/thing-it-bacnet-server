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
import * as BACNet from 'tid-bacnet-logic';

import { IEDEUnit, IStateTextsUnit } from '../../../../core/interfaces';

import { MultiStateInputMetadata } from './multi-state-input.metadata';

import { MultiStateUnit } from '../multi-state.unit';

export class MultiStateInputUnit extends MultiStateUnit {
    public readonly className: string = 'MultiStateInputUnit';

    public initUnit (edeUnit: IEDEUnit, stateTextUnits: IStateTextsUnit[]) {
        super.initUnit(edeUnit, stateTextUnits);

        this.storage.addUnitStorage(MultiStateInputMetadata);
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
    }

    /**
     * shSetPresentValue - handles the changes of 'Present Value' property.
     *
     * @param  {UnitStorageProperty} notif - notification object for presentValue
     * @return {void}
     */
    private shSetPresentValue (notif: UnitStorageProperty): void {
        this.storage.updateProperty(notif);
        this.storage.dispatch();
    }
}
