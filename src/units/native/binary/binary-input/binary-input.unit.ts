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

    constructor () {
        super();
        this.storage.addUnitStorage(BinaryInputMetadata);
    }

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);

        this.dispatchCOVNotification();
    }

    /**
     * sjHandler - handles the changes of properties.
     *
     * @param  {IBACnetObjectProperty} notif - notification object
     * @return {void}
     */
    public sjHandler (): void {
        super.sjHandler();

        this.storage.setSjHandler(BACnetPropIds.polarity, (notif) => {
            this.shPolarity(notif);
        });
        this.storage.setSjHandler(BACnetPropIds.presentValue, (notif) => {
            this.shPresentValue(notif);
        });
    }

    /**
     * shPolarity - handles the changes of 'Polarity' property.
     * Method checks the "outOfService" BACnet property and if it equals "FALSE"
     * then method will change the "presentValue" BACnet property.
     *
     * @param  {IBACnetObjectProperty} notif - notification object for Polarity
     * @return {void}
     */
    private shPolarity (notif: IBACnetObjectProperty): void {
        const outOfServiceProp = this.storage.getProperty(BACnetPropIds.outOfService);
        const outOfService = outOfServiceProp.payload as BACnetTypes.BACnetBoolean;

        if (outOfService.value) {
            return;
        }

        const polarityProp = this.storage.getProperty(BACnetPropIds.polarity);
        const polarity = polarityProp.payload as BACnetTypes.BACnetEnumerated;
        const newPolarity = notif.payload as BACnetTypes.BACnetEnumerated;

        if (polarity.value === newPolarity.value) {
            return;
        }

        this.storage.updateProperty(notif);

        const presentValueProp = this.storage.getProperty(BACnetPropIds.presentValue);
        const presentValue = presentValueProp.payload as BACnetTypes.BACnetEnumerated;

        let newPresentValue: BACnetTypes.BACnetEnumerated;
        switch (presentValue.value) {
            case BACnetBinaryPV.Active:
                newPresentValue = new BACnetTypes.BACnetEnumerated(BACnetBinaryPV.Inactive);
                break;
            case BACnetBinaryPV.Inactive:
                newPresentValue = new BACnetTypes.BACnetEnumerated(BACnetBinaryPV.Active);
                break;
            default:
                newPresentValue = new BACnetTypes.BACnetEnumerated(BACnetBinaryPV.Inactive);
                break;
        }

        this.storage.setProperty({
            id: BACnetPropIds.presentValue,
            payload: newPresentValue,
        });
    }

    /**
     * shPresentValue - handles the changes of 'Present Value' property.
     *
     * @param  {IBACnetObjectProperty} notif - notification object for presentValue
     * @return {void}
     */
    private shPresentValue (notif: IBACnetObjectProperty): void {
        this.storage.updateProperty(notif);
        this.dispatchCOVNotification();
    }
}
