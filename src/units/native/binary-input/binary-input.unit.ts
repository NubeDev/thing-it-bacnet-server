import * as _ from 'lodash';

import {
    BACnetPropIds,
    BACnetBinaryPV,
    BACnetEventState,
} from '../../../core/enums';

import {
    ApiError,
} from '../../../core/errors';

import {
    IBACnetObjectProperty,
    IBACnetTypeBoolean,
    IBACnetTypeEnumerated,
    IBACnetTypeStatusFlags,
    IBACnetPropertyNotification,
    IEDEUnit,
} from '../../../core/interfaces';

import { BinaryInputMetadata } from './binary-input.metadata';

import { NativeUnit } from '../native.unit';

export class BinaryInputUnit extends NativeUnit {
    public readonly className: string = 'BinaryInputUnit';
    public metadata: IBACnetObjectProperty[];

    constructor (edeUnit: IEDEUnit) {
        super(edeUnit, BinaryInputMetadata);
    }

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);

        this.sjData.subscribe((notif) => {
            switch (notif.id) {
                case BACnetPropIds.eventState:
                    return this.shEventState(notif);
                case BACnetPropIds.outOfService:
                    return this.shOutOfService(notif);
                case BACnetPropIds.reliability:
                    return this.shOutOfService(notif);
                case BACnetPropIds.polarity:
                    return this.shPolarity(notif);
                case BACnetPropIds.presentValue:
                    return this.shPresentValue(notif);
                case BACnetPropIds.statusFlags:
                    return this.shStatusFlags(notif);
            }
        });
    }

    /**
     * shEventState - handles the changes of 'Event State' property.
     * Method changes the "shEventState" field in "statusFlags" BACnet property.
     *
     * @param  {IBACnetPropertyNotification} notif - notification object for eventState
     * @return {void}
     */
    private shEventState (notif: IBACnetPropertyNotification): void {
        const statusFlags = this.findProperty(BACnetPropIds.statusFlags);
        const statusFlagsPayload = statusFlags.payload as IBACnetTypeStatusFlags;

        const eventStatePayload = notif.newValue as IBACnetTypeEnumerated;
        const newInAlarm = eventStatePayload.value !== BACnetEventState.Normal;

        if (statusFlagsPayload.inAlarm === newInAlarm) {
            return;
        }

        const newStatusFlags: IBACnetTypeStatusFlags = _.assign({}, statusFlagsPayload, {
            inAlarm: newInAlarm,
        });

        this.setProperty(BACnetPropIds.statusFlags, newStatusFlags);
    }

    /**
     * shOutOfService - handles the changes of 'Out of Service' property.
     * Method changes the "outOfService" field in "statusFlags" BACnet property.
     *
     * @param  {IBACnetPropertyNotification} notif - notification object for outOfService
     * @return {void}
     */
    private shOutOfService (notif: IBACnetPropertyNotification): void {
        const statusFlags = this.findProperty(BACnetPropIds.statusFlags);
        const statusFlagsPayload = statusFlags.payload as IBACnetTypeStatusFlags;

        const outOfServicePayload = notif.newValue as IBACnetTypeBoolean;

        const newStatusFlags: IBACnetTypeStatusFlags = _.assign({}, statusFlagsPayload, {
            outOfService: !!outOfServicePayload.value,
        });

        this.setProperty(BACnetPropIds.statusFlags, newStatusFlags);
    }

    /**
     * shReliability - handles the changes of 'Reliability' property.
     * Method changes the "fault" field in "statusFlags" BACnet property.
     *
     * @param  {IBACnetPropertyNotification} notif - notification object for reliability
     * @return {void}
     */
    private shReliability (notif: IBACnetPropertyNotification): void {
        const statusFlags = this.findProperty(BACnetPropIds.statusFlags);
        const statusFlagsPayload = statusFlags.payload as IBACnetTypeStatusFlags;

        const reliabilityPayload = notif.newValue as IBACnetTypeBoolean;

        const newStatusFlags: IBACnetTypeStatusFlags = _.assign({}, statusFlagsPayload, {
            fault: !!reliabilityPayload.value,
        });

        this.setProperty(BACnetPropIds.statusFlags, newStatusFlags);
    }

    /**
     * shPolarity - handles the changes of 'Polarity' property.
     * Method checks the "outOfService" BACnet property and if it equals "FALSE"
     * then method will change the "presentValue" BACnet property.
     *
     * @param  {IBACnetPropertyNotification} notif - notification object for Polarity
     * @return {void}
     */
    private shPolarity (notif: IBACnetPropertyNotification): void {
        const outOfService = this.findProperty(BACnetPropIds.outOfService);
        const outOfServicePayload = outOfService.payload as IBACnetTypeBoolean;

        if (outOfServicePayload.value) {
            return;
        }

        const oldValue = notif.oldValue as IBACnetTypeEnumerated;
        const newValue = notif.newValue as IBACnetTypeEnumerated;

        if (oldValue.value === newValue.value) {
            return;
        }

        const presentValue = this.findProperty(BACnetPropIds.presentValue);
        const presentValuePayload = presentValue.payload as IBACnetTypeEnumerated;

        let newPresentValue: IBACnetTypeEnumerated;
        switch (presentValuePayload.value) {
            case BACnetBinaryPV.Active:
                newPresentValue = { value: BACnetBinaryPV.Inactive };
                break;
            case BACnetBinaryPV.Inactive:
                newPresentValue = { value: BACnetBinaryPV.Active };
                break;
            default:
                newPresentValue = { value: BACnetBinaryPV.Inactive };
                break;
        }

        this.setProperty(BACnetPropIds.presentValue, newPresentValue);
    }

    /**
     * shPresentValue - handles the changes of 'Present Value' property.
     *
     * @param  {IBACnetPropertyNotification} notif - notification object for presentValue
     * @return {void}
     */
    private shPresentValue (notif: IBACnetPropertyNotification): void {
        this.dipatchCOVNotification();
    }

    /**
     * shStatusFlags - handles the changes of 'Status Flags' property.
     *
     * @param  {IBACnetPropertyNotification} notif - notification object for statusFlags
     * @return {void}
     */
    private shStatusFlags (notif: IBACnetPropertyNotification): void {
        this.dipatchCOVNotification();
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
