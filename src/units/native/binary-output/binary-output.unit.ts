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

import { BinaryOutputMetadata } from './binary-output.metadata';

import { NativeUnit } from '../native.unit';

import * as BACnetTypes from '../../../core/utils/types';

export class BinaryOutputUnit extends NativeUnit {
    public readonly className: string = 'BinaryOutputUnit';

    constructor (edeUnit: IEDEUnit) {
        super(edeUnit, BinaryOutputMetadata);
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
    public sjHandler (notif: IBACnetObjectProperty): void {
        switch (notif.id) {
            case BACnetPropIds.eventState:
                this.updateProperty(notif);
                return this.shEventState(notif);
            case BACnetPropIds.outOfService:
                this.updateProperty(notif);
                return this.shOutOfService(notif);
            case BACnetPropIds.reliability:
                this.updateProperty(notif);
                return this.shReliability(notif);
            case BACnetPropIds.statusFlags:
                return this.shStatusFlags(notif);

            case BACnetPropIds.polarity:
                return this.shPolarity(notif);
            case BACnetPropIds.presentValue:
                return this.shPresentValue(notif);
            case BACnetPropIds.priorityArray:
                return this.shPriorityArray(notif);
            default:
                return this.updateProperty(notif);
        }
    }

    /**
     * shEventState - handles the changes of 'Event State' property.
     * - Method changes the "shEventState" field in "statusFlags" BACnet property.
     *
     * @param  {IBACnetObjectProperty} notif - notification object for eventState
     * @return {void}
     */
    private shEventState (notif: IBACnetObjectProperty): void {
        const statusFlagsProp = this.getProperty(BACnetPropIds.statusFlags);
        const statusFlags = statusFlagsProp.payload as BACnetTypes.BACnetStatusFlags;

        const eventState = notif.payload as BACnetTypes.BACnetEnumerated;
        const newInAlarm = eventState.value !== BACnetEventState.Normal;

        if (statusFlags.value.inAlarm === newInAlarm) {
            return;
        }

        const newStatusFlagsValue: IBACnetTypeStatusFlags = _.assign({}, statusFlags.value, {
            inAlarm: newInAlarm,
        });
        const newStatusFlags = new BACnetTypes.BACnetStatusFlags(newStatusFlagsValue);

        this.setProperty({
            id: BACnetPropIds.statusFlags,
            payload: newStatusFlags,
        });
    }

    /**
     * shOutOfService - handles the changes of 'Out of Service' property.
     * - Method changes the "outOfService" field in "statusFlags" BACnet property.
     *
     * @param  {IBACnetObjectProperty} notif - notification object for outOfService
     * @return {void}
     */
    private shOutOfService (notif: IBACnetObjectProperty): void {
        const statusFlagsProp = this.getProperty(BACnetPropIds.statusFlags);
        const statusFlags = statusFlagsProp.payload as BACnetTypes.BACnetStatusFlags;

        const outOfService = notif.payload as BACnetTypes.BACnetBoolean;

        const newStatusFlagsValue: IBACnetTypeStatusFlags = _.assign({}, statusFlags.value, {
            outOfService: !!outOfService.value,
        });
        const newStatusFlags = new BACnetTypes.BACnetStatusFlags(newStatusFlagsValue);

        this.setProperty({
            id: BACnetPropIds.statusFlags,
            payload: newStatusFlags,
        });
    }

    /**
     * shReliability - handles the changes of 'Reliability' property.
     * - Method changes the "fault" field in "statusFlags" BACnet property.
     *
     * @param  {IBACnetObjectProperty} notif - notification object for reliability
     * @return {void}
     */
    private shReliability (notif: IBACnetObjectProperty): void {
        const statusFlagsProp = this.getProperty(BACnetPropIds.statusFlags);
        const statusFlags = statusFlagsProp.payload as BACnetTypes.BACnetStatusFlags;

        const reliability = notif.payload as BACnetTypes.BACnetEnumerated;

        const newStatusFlagsValue: IBACnetTypeStatusFlags = _.assign({}, statusFlags.value, {
            fault: !!reliability.value,
        });
        const newStatusFlags = new BACnetTypes.BACnetStatusFlags(newStatusFlagsValue);

        this.setProperty({
            id: BACnetPropIds.statusFlags,
            payload: newStatusFlags,
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
        const outOfServiceProp = this.getProperty(BACnetPropIds.outOfService);
        const outOfService = outOfServiceProp.payload as BACnetTypes.BACnetBoolean;

        if (outOfService.value) {
            return;
        }

        const polarityProp = this.getProperty(BACnetPropIds.polarity);
        const polarity = polarityProp.payload as BACnetTypes.BACnetEnumerated;
        const newPolarity = notif.payload as BACnetTypes.BACnetEnumerated;

        if (polarity.value === newPolarity.value) {
            return;
        }

        this.updateProperty(notif);

        const presentValueProp = this.getProperty(BACnetPropIds.presentValue);
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

        this.setProperty({
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
     * - If polarity has a "Reverse" state, then method will reverse the value
     * of "presentValue" BACnet property.
     *
     * @param  {IBACnetObjectProperty} notif - notification object for priorityArray
     * @return {void}
     */
    private shPriorityArray (notif: IBACnetObjectProperty): void {
        const presentValueProp = this.getProperty(BACnetPropIds.presentValue);
        const presentValue = presentValueProp.payload as BACnetTypes.BACnetEnumerated;

        const newPresentValue = this.getCommandablePropertyValue() as BACnetTypes.BACnetEnumerated;

        const polarityProp = this.getProperty(BACnetPropIds.polarity);
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

        this.updateProperty({
            id: BACnetPropIds.presentValue,
            payload: newPresentValue,
        });

        this.dispatchCOVNotification();
    }

    /**
     * shStatusFlags - handles the changes of 'Status Flags' property.
     * - Method calculates the "overridden" status flag state and will set it if
     * old value does not equal to the calculated "overridden" state.
     *
     * @param  {IBACnetObjectProperty} notif - notification object for statusFlags
     * @return {void}
     */
    private shStatusFlags (notif: IBACnetObjectProperty): void {
        const statusFlagsProp = this.getProperty(BACnetPropIds.statusFlags);
        const statusFlags = statusFlagsProp.payload as BACnetTypes.BACnetStatusFlags;

        const overridden = statusFlags.value.fault
            || statusFlags.value.outOfService
            || statusFlags.value.inAlarm;

        if (!!overridden === statusFlags.value.overridden) {
            this.dispatchCOVNotification();
            return;
        }

        const newStatusFlagsValue: IBACnetTypeStatusFlags = _.assign({}, statusFlags.value, {
            overridden: !!overridden,
        });
        const newStatusFlags = new BACnetTypes.BACnetStatusFlags(newStatusFlagsValue);

        this.updateProperty({
            id: BACnetPropIds.statusFlags,
            payload: newStatusFlags,
        });
    }

    /**
     * getReportedProperties - returns the reported properties for COV notification.
     *
     * @return {IBACnetObjectProperty[]}
     */
    protected getReportedProperties (): IBACnetObjectProperty[] {
        const presentValue = this.getProperty(BACnetPropIds.presentValue);
        const statusFlags = this.getProperty(BACnetPropIds.statusFlags);

        return [ presentValue, statusFlags ];
    }
}
