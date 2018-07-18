import * as _ from 'lodash';

import {
    BACnetUnitDataFlow,
} from '../../../../core/enums';

import {
    UnitPropertyObject,
} from '../../../../core/interfaces';

import { IEDEUnit } from '../../../../core/interfaces';

import { CommandableMiddleMetadata } from './commandable.metadata';

import { MiddleUnit } from '../middle.unit';

import * as BACNet from 'tid-bacnet-logic';

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
     * @param  {UnitPropertyObject} notif - notification object
     * @return {void}
     */
    public sjHandler (): void {
        this.storage.setFlowHandler(BACnetUnitDataFlow.Set, BACNet.Enums.PropertyId.presentValue, (notif) => {
            this.shSetPresentValue(notif);
        });

        this.storage.setFlowHandler(BACnetUnitDataFlow.Set, BACNet.Enums.PropertyId.priorityArray, (notif) => {
            this.shSetPriorityArray(notif);
        });
    }

    /**
     * shSetPresentValue - handles the changes of 'Present Value' property.
     * - Method sets new commandable value in "priorityArray" BACnet property by priority.
     *
     * @param  {UnitPropertyObject} notif - notification object for presentValue
     * @return {void}
     */
    private shSetPresentValue (notif: UnitPropertyObject): void {
        const priorityArrayProp = this.storage.getProperty(BACNet.Enums.PropertyId.priorityArray);
        const priorityArray = priorityArrayProp.payload as BACNet.Types.BACnetTypeBase[];

        const newPriorityArrayEl = notif.payload as BACNet.Types.BACnetTypeBase;
        const priority = _.isNumber(notif.priority) ? notif.priority - 1 : 15;

        const newPriorityArray = [ ...priorityArray ];
        newPriorityArray[priority] = newPriorityArrayEl;

        this.storage.setProperty({
            id: BACNet.Enums.PropertyId.priorityArray,
            payload: newPriorityArray,
        });
    }

    /**
     * shSetPriorityArray - handles the changes of 'Priority Array' property.
     * - Method sets the new commandable value of "presentValue" BACnet property.
     * Commandable value will be got from "getCommandablePropertyValue" method.
     *
     * @param  {UnitPropertyObject} notif - notification object for priorityArray
     * @return {void}
     */
    private shSetPriorityArray (notif: UnitPropertyObject): void {
        this.storage.updateProperty(notif);
        const newPresentValue = this.getCommandablePropertyValue() as BACNet.Types.BACnetTypeBase;

        this.storage.updateProperty({
            id: BACNet.Enums.PropertyId.presentValue,
            payload: newPresentValue,
        });
    }

    /**
     * getCommandablePropertyValue - return the value of the commandable property.
     *
     * @return {IBACnetType}
     */
    private getCommandablePropertyValue (): BACNet.Types.BACnetTypeBase {
        const priorityArrayProp = this.storage.getProperty(BACNet.Enums.PropertyId.priorityArray);
        const priorityArray = priorityArrayProp.payload as BACNet.Types.BACnetTypeBase[];

        let priorityArrayValue: BACNet.Types.BACnetTypeBase, i: number;
        for (i = 0; i < priorityArray.length; i++) {
            if (priorityArray[i].className === `BACnetNull`) {
                continue;
            }
            priorityArrayValue = priorityArray[i];
            break;
        }

        const priorityIndex: BACNet.Types.BACnetTypeBase = i === priorityArray.length
            ? new BACNet.Types.BACnetNull()
            : new BACNet.Types.BACnetUnsignedInteger(i);
        this.storage.setProperty({
            id: BACNet.Enums.PropertyId.currentCommandPriority,
            payload: priorityIndex,
        });

        if (_.isNil(priorityArrayValue)) {
            const relinquishDefaultProp = this.storage.getProperty(BACNet.Enums.PropertyId.relinquishDefault);
            const relinquishDefault = relinquishDefaultProp.payload as BACNet.Types.BACnetTypeBase;
            priorityArrayValue = relinquishDefault;
        }
        return _.cloneDeep(priorityArrayValue);
    }
}
