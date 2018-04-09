import * as _ from 'lodash';

import {
    BACnetPropIds,
    BACnetBinaryPV,
    BACnetEventState,
    BACnetPolarity,
} from '../../../../core/enums';

import {
    ApiError,
} from '../../../../core/errors';

import {
    IBACnetObjectProperty,
    IBACnetTypeStatusFlags,
    IEDEUnit,
} from '../../../../core/interfaces';

import { BinaryOutputMetadata } from './binary-output.metadata';

import { BinaryUnit } from '../binary.unit';

import * as BACnetTypes from '../../../../core/utils/types';

export class BinaryOutputUnit extends BinaryUnit {
    public readonly className: string = 'BinaryOutputUnit';

    constructor () {
        super();
        this.storage.addUnitStorage(BinaryOutputMetadata);
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
        this.storage.setSjHandler(BACnetPropIds.priorityArray, (notif) => {
            this.shPriorityArray(notif);
        });
    }

    /**
     * shPolarity - handles the changes of 'Polarity' property.
     * - Method checks the "outOfService" BACnet property and if it equals "FALSE"
     * then method will try to change the "presentValue" BACnet property.
     * - Method reverse the "presentValue" BACnet property if polarity has changed.
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
     * - Method sets new commandable value in "priorityArray" BACnet property by priority.
     *
     * @param  {IBACnetObjectProperty} notif - notification object for presentValue
     * @return {void}
     */
    private shPresentValue (notif: IBACnetObjectProperty): void {
        const priorityArrayProp = this.storage.getProperty(BACnetPropIds.priorityArray);
        const priorityArray = priorityArrayProp.payload as BACnetTypes.BACnetTypeBase[];

        const newPriorityArrayEl = notif.payload as BACnetTypes.BACnetTypeBase;
        const priority = _.isNumber(notif.priority) ? notif.priority - 1 : 15;

        const newPriorityArray = [ ...priorityArray ];
        newPriorityArray[priority] = newPriorityArrayEl;

        this.storage.setProperty({
            id: BACnetPropIds.priorityArray,
            payload: newPriorityArray,
        });
    }

    /**
     * shPriorityArray - handles the changes of 'Priority Array' property.
     * - Method sets the new commandable value of "presentValue" BACnet property.
     * Commandable value will be got from "getCommandablePropertyValue" method.
     * - If polarity has a "Reverse" state, then method will reverse the value
     * of "presentValue" BACnet property.
     *
     * @param  {IBACnetObjectProperty} notif - notification object for priorityArray
     * @return {void}
     */
    private shPriorityArray (notif: IBACnetObjectProperty): void {
        const presentValueProp = this.storage.getProperty(BACnetPropIds.presentValue);
        const presentValue = presentValueProp.payload as BACnetTypes.BACnetEnumerated;

        this.storage.updateProperty(notif);
        const newPresentValue = this.getCommandablePropertyValue() as BACnetTypes.BACnetEnumerated;

        const polarityProp = this.storage.getProperty(BACnetPropIds.polarity);
        const polarity = polarityProp.payload as BACnetTypes.BACnetEnumerated;

        if (polarity.value === BACnetPolarity.Reverse) {
            switch (newPresentValue.value) {
                case BACnetBinaryPV.Active:
                    newPresentValue.value = BACnetBinaryPV.Inactive;
                    break;
                case BACnetBinaryPV.Inactive:
                    newPresentValue.value = BACnetBinaryPV.Active;
                    break;
                default:
                    newPresentValue.value = BACnetBinaryPV.Inactive;
                    break;
            }
        }

        this.storage.updateProperty({
            id: BACnetPropIds.presentValue,
            payload: newPresentValue,
        });

        this.dispatchCOVNotification();
    }
}
