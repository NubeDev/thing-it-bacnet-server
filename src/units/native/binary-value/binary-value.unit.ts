import * as _ from 'lodash';

import {
    BACnetPropIds,
    BACnetBinaryPV,
    BACnetEventState,
    BACnetPolarity,
} from '../../../core/enums';

import {
    ApiError,
} from '../../../core/errors';

import {
    IBACnetObjectProperty,
    IBACnetTypeStatusFlags,
    IEDEUnit,
} from '../../../core/interfaces';

import { BinaryValueMetadata } from './binary-value.metadata';

import { BinaryMiddleUnit } from '../binary-middle/binary-middle.unit';

import * as BACnetTypes from '../../../core/utils/types';

export class BinaryValueUnit extends BinaryMiddleUnit {
    public readonly className: string = 'BinaryValueUnit';

    constructor (edeUnit: IEDEUnit) {
        super(edeUnit, BinaryValueMetadata);
    }

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);
    }

    /**
     * sjHandler - handles the changes of properties.
     *
     * @param  {IBACnetObjectProperty} notif - notification object
     * @return {void}
     */
    public sjHandler (notif: IBACnetObjectProperty): boolean {
        const isSkipped = super.sjHandler(notif);
        if (!isSkipped) {
            return;
        }

        switch (notif.id) {
            case BACnetPropIds.presentValue:
                this.shPresentValue(notif);
                return;
            case BACnetPropIds.priorityArray:
                this.shPriorityArray(notif);
                return;
            default:
                this.updateProperty(notif);
                return;
        }
    }

    /**
     * shPresentValue - handles the changes of 'Present Value' property.
     * - Method sets new commandable value in "priorityArray" BACnet property by priority.
     *
     * @param  {IBACnetObjectProperty} notif - notification object for presentValue
     * @return {void}
     */
    private shPresentValue (notif: IBACnetObjectProperty): void {
        const priorityArrayProp = this.getProperty(BACnetPropIds.priorityArray);
        const priorityArray = priorityArrayProp.payload as BACnetTypes.BACnetTypeBase[];

        const newPriorityArrayEl = notif.payload as BACnetTypes.BACnetTypeBase;
        const priority = _.isNumber(notif.priority) ? notif.priority - 1 : 15;

        const newPriorityArray = [ ...priorityArray ];
        newPriorityArray[priority] = newPriorityArrayEl;

        this.setProperty({
            id: BACnetPropIds.priorityArray,
            payload: newPriorityArray,
        });
    }

    /**
     * shPriorityArray - handles the changes of 'Priority Array' property.
     * - Method sets the new commandable value of "presentValue" BACnet property.
     * Commandable value will be got from "getCommandablePropertyValue" method.
     *
     * @param  {IBACnetObjectProperty} notif - notification object for priorityArray
     * @return {void}
     */
    private shPriorityArray (notif: IBACnetObjectProperty): void {
        const presentValueProp = this.getProperty(BACnetPropIds.presentValue);
        const presentValue = presentValueProp.payload as BACnetTypes.BACnetEnumerated;

        const newPresentValue = this.getCommandablePropertyValue() as BACnetTypes.BACnetEnumerated;

        this.updateProperty({
            id: BACnetPropIds.presentValue,
            payload: newPresentValue,
        });

        this.dispatchCOVNotification();
    }
}
