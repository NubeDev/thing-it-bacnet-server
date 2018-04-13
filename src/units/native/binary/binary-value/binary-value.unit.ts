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

import { BinaryValueMetadata } from './binary-value.metadata';

import { BinaryUnit } from '../binary.unit';

import * as BACnetTypes from '../../../../core/utils/types';

export class BinaryValueUnit extends BinaryUnit {
    public readonly className: string = 'BinaryValueUnit';

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);

        this.storage.addUnitStorage(BinaryValueMetadata);

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
            this.shPresentValue(notif);
        });

        this.storage.setFlowHandler('set', BACnetPropIds.priorityArray, (notif) => {
            this.shPriorityArray(notif);
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
     *
     * @param  {IBACnetObjectProperty} notif - notification object for priorityArray
     * @return {void}
     */
    private shPriorityArray (notif: IBACnetObjectProperty): void {
        this.storage.updateProperty(notif);
        const newPresentValue = this.getCommandablePropertyValue() as BACnetTypes.BACnetEnumerated;

        this.storage.updateProperty({
            id: BACnetPropIds.presentValue,
            payload: newPresentValue,
        });

        this.storage.dispatch();
    }
}
