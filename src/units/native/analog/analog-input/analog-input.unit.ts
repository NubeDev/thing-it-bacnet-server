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

import { AnalogInputMetadata } from './analog-input.metadata';

import { AnalogUnit } from '../analog.unit';

export class AnalogInputUnit extends AnalogUnit {
    public readonly className: string = 'AnalogInputUnit';

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);

        this.storage.addUnitStorage(AnalogInputMetadata);
    }

    /**
     * sjHandler - handles the changes of properties.
     *
     * @param  {IBACnetObjectProperty} notif - notification object
     * @return {void}
     */
    public sjHandler (): void {
        super.sjHandler();

        this.storage.setFlowHandler(BACnetUnitDataFlow.Set, BACnetPropertyId.presentValue, (notif) => {
            this.shSetPresentValue(notif);
        });
    }

    /**
     * shSetPresentValue - handles the changes of 'Present Value' property.
     *
     * @param  {IBACnetObjectProperty} notif - notification object for presentValue
     * @return {void}
     */
    private shSetPresentValue (notif: IBACnetObjectProperty): void {
        this.storage.updateProperty(notif);
        this.storage.dispatch();
    }
}
