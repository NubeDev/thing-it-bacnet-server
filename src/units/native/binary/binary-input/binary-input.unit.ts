import * as _ from 'lodash';

import {
    // BACnetPropertyId,
    // BACnetBinaryPV,
    // BACnetEventState,
    BACnetUnitDataFlow,
} from '../../../../core/enums';

import {
    ApiError,
} from '../../../../core/errors';

import {
    UnitPropertyObject,
} from '../../../../core/interfaces';

import { IEDEUnit } from '../../../../core/interfaces';

import { BinaryInputMetadata } from './binary-input.metadata';

import { BinaryUnit } from '../../binary/binary.unit';

// import * as BACnetTypes from '../../../../core/bacnet/types';
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
     * @param  {UnitPropertyObject} notif - notification object
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
     * @param  {UnitPropertyObject} notif - notification object for presentValue
     * @return {void}
     */
    private shSetPresentValue (notif: UnitPropertyObject): void {
        this.storage.updateProperty(notif);
        this.storage.dispatch();
    }
}
