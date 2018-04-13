import * as _ from 'lodash';

import {
    BACnetPropIds,
    BACnetBinaryPV,
    BACnetEventState,
} from '../../../../core/enums';

import {
    ApiError,
} from '../../../../core/errors';

import {
    IBACnetObjectProperty,
    IBACnetTypeStatusFlags,
    IEDEUnit,
} from '../../../../core/interfaces';

import { BinaryInputMetadata } from './binary-input.metadata';

import { BinaryUnit } from '../../binary/binary.unit';

import * as BACnetTypes from '../../../../core/utils/types';

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
     * @param  {IBACnetObjectProperty} notif - notification object
     * @return {void}
     */
    public sjHandler (): void {
        super.sjHandler();

        this.storage.setFlowHandler('set', BACnetPropIds.presentValue, (notif) => {
            this.shSetPresentValue(notif);
        });
    }

    /**
     * shPresentValue - handles the changes of 'Present Value' property.
     *
     * @param  {IBACnetObjectProperty} notif - notification object for presentValue
     * @return {void}
     */
    private shSetPresentValue (notif: IBACnetObjectProperty): void {
        this.storage.updateProperty(notif);
        this.storage.dispatch();
    }
}
