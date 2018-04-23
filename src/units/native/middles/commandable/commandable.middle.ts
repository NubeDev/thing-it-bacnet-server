import * as _ from 'lodash';

import {
    BACnetPropertyId,
    BACnetUnitDataFlow,
} from '../../../../core/enums';

import {
    IBACnetObjectProperty,
    IEDEUnit,
} from '../../../../core/interfaces';

import { CommandableMiddleMetadata } from './commandable.metadata';

import { MiddleUnit } from '../middle.unit';

import * as BACnetTypes from '../../../../core/types';
import { TyperUtil } from '../../../../core/utils';

export class CommandableMiddleUnit extends MiddleUnit {
    public readonly className: string = 'StatusFlagsMiddleUnit';

    /**
     * initMiddle - initializes the middle unit.
     *
     * @param  {IEDEUnit} edeUnit -  ede unit configuration
     * @return {void}
     */
    public initMiddle (edeUnit?: IEDEUnit): void {
        super.initMiddle(edeUnit);

        this.storage.addUnitStorage(CommandableMiddleMetadata);
    }

    /**
     * sjHandler - handles the changes of properties.
     *
     * @param  {IBACnetObjectProperty} notif - notification object
     * @return {void}
     */
    public sjHandler (): void {
        this.storage.setFlowHandler(BACnetUnitDataFlow.Set, BACnetPropertyId.presentValue, (notif) => {
            this.shSetPresentValue(notif);
        });

        this.storage.setFlowHandler(BACnetUnitDataFlow.Set, BACnetPropertyId.priorityArray, (notif) => {
            this.shSetPriorityArray(notif);
        });
    }

    /**
     * shSetPresentValue - handles the changes of 'Present Value' property.
     * - Method sets new commandable value in "priorityArray" BACnet property by priority.
     *
     * @param  {IBACnetObjectProperty} notif - notification object for presentValue
     * @return {void}
     */
    private shSetPresentValue (notif: IBACnetObjectProperty): void {
        const priorityArrayProp = this.storage.getProperty(BACnetPropertyId.priorityArray);
        const priorityArray = priorityArrayProp.payload as BACnetTypes.BACnetTypeBase[];

        const newPriorityArrayEl = notif.payload as BACnetTypes.BACnetTypeBase;
        const priority = _.isNumber(notif.priority) ? notif.priority - 1 : 15;

        const newPriorityArray = [ ...priorityArray ];
        newPriorityArray[priority] = newPriorityArrayEl;

        this.storage.setProperty({
            id: BACnetPropertyId.priorityArray,
            payload: newPriorityArray,
        });
    }

    /**
     * shSetPriorityArray - handles the changes of 'Priority Array' property.
     * - Method sets the new commandable value of "presentValue" BACnet property.
     * Commandable value will be got from "getCommandablePropertyValue" method.
     *
     * @param  {IBACnetObjectProperty} notif - notification object for priorityArray
     * @return {void}
     */
    private shSetPriorityArray (notif: IBACnetObjectProperty): void {
        this.storage.updateProperty(notif);
        const newPresentValue = this.getCommandablePropertyValue() as BACnetTypes.BACnetTypeBase;

        this.storage.updateProperty({
            id: BACnetPropertyId.presentValue,
            payload: newPresentValue,
        });
    }

    /**
     * getCommandablePropertyValue - return the value of the commandable property.
     *
     * @return {IBACnetType}
     */
    private getCommandablePropertyValue (): BACnetTypes.BACnetTypeBase {
        const priorityArrayProp = this.storage.getProperty(BACnetPropertyId.priorityArray);
        const priorityArray = priorityArrayProp.payload as BACnetTypes.BACnetTypeBase[];

        let priorityArrayValue: BACnetTypes.BACnetTypeBase, i: number;
        for (i = 0; i < priorityArray.length; i++) {
            if (TyperUtil.isNil(priorityArray[i])) {
                continue;
            }
            priorityArrayValue = priorityArray[i];
            break;
        }

        const priorityIndex: BACnetTypes.BACnetTypeBase = i === priorityArray.length
            ? new BACnetTypes.BACnetNull()
            : new BACnetTypes.BACnetUnsignedInteger(i);
        this.storage.setProperty({
            id: BACnetPropertyId.currentCommandPriority,
            payload: priorityIndex,
        });

        if (_.isNil(priorityArrayValue)) {
            const relinquishDefaultProp = this.storage.getProperty(BACnetPropertyId.relinquishDefault);
            const relinquishDefault = relinquishDefaultProp.payload as BACnetTypes.BACnetTypeBase;
            priorityArrayValue = relinquishDefault;
        }
        return _.cloneDeep(priorityArrayValue);
    }
}
