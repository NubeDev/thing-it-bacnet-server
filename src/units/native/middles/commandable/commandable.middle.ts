import * as _ from 'lodash';

import {
    BACnetPropIds,
} from '../../../../core/enums';

import {
    ApiError,
} from '../../../../core/errors';

import {
    IBACnetObjectProperty,
    IEDEUnit,
} from '../../../../core/interfaces';

import { CommandableMiddleMetadata } from './commandable.metadata';

import { MiddleUnit } from '../middle.unit';
import { UnitStorage } from '../../unit.storage';

import * as BACnetTypes from '../../../../core/utils/types';
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
        this.storage.setSjHandler(BACnetPropIds.presentValue, (notif) => {
            this.shPresentValue(notif);
        });

        this.storage.setSjHandler(BACnetPropIds.priorityArray, (notif) => {
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
        const newPresentValue = this.getCommandablePropertyValue() as BACnetTypes.BACnetTypeBase;

        this.storage.updateProperty({
            id: BACnetPropIds.presentValue,
            payload: newPresentValue,
        });

        this.storage.dispatch();
    }

    /**
     * getCommandablePropertyValue - return the value of the commandable property.
     *
     * @return {IBACnetType}
     */
    private getCommandablePropertyValue (): BACnetTypes.BACnetTypeBase {
        const priorityArrayProp = this.storage.getProperty(BACnetPropIds.priorityArray);
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
            id: BACnetPropIds.currentCommandPriority,
            payload: priorityIndex,
        });

        if (_.isNil(priorityArrayValue)) {
            const relinquishDefaultProp = this.storage.getProperty(BACnetPropIds.relinquishDefault);
            const relinquishDefault = relinquishDefaultProp.payload as BACnetTypes.BACnetTypeBase;
            priorityArrayValue = relinquishDefault;
        }
        return _.cloneDeep(priorityArrayValue);
    }
}
