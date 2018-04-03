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
    IEDEUnit,
} from '../../../core/interfaces';

import { BinaryInputMetadata } from './binary-input.metadata';

import { NativeUnit } from '../native.unit';

export class BinaryInputUnit extends NativeUnit {
    public readonly className: string = 'BinaryInputUnit';

    constructor (edeUnit: IEDEUnit) {
        super(edeUnit, BinaryInputMetadata);
    }

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);

        const reportedProps = this.getReportedProperties();
        this.sjCOV.next(reportedProps);
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
            case BACnetPropIds.polarity:
                return this.shPolarity(notif);
            case BACnetPropIds.presentValue:
                this.updateProperty(notif);
                return this.shPresentValue(notif);
            case BACnetPropIds.statusFlags:
                return this.shStatusFlags(notif);
            default:
                return this.updateProperty(notif);
        }
    }

    /**
     * shEventState - handles the changes of 'Event State' property.
     * Method changes the "shEventState" field in "statusFlags" BACnet property.
     *
     * @param  {IBACnetObjectProperty} notif - notification object for eventState
     * @return {void}
     */
    private shEventState (notif: IBACnetObjectProperty): void {
        const statusFlags = this.getProperty(BACnetPropIds.statusFlags);
        const statusFlagsPayload = statusFlags.payload as IBACnetTypeStatusFlags;

        const eventStatePayload = notif.payload as IBACnetTypeEnumerated;
        const newInAlarm = eventStatePayload.value !== BACnetEventState.Normal;

        if (statusFlagsPayload.inAlarm === newInAlarm) {
            return;
        }

        const newStatusFlags: IBACnetTypeStatusFlags = _.assign({}, statusFlagsPayload, {
            inAlarm: newInAlarm,
        });

        this.setProperty({
            id: BACnetPropIds.statusFlags,
            payload: newStatusFlags,
        });
    }

    /**
     * shOutOfService - handles the changes of 'Out of Service' property.
     * Method changes the "outOfService" field in "statusFlags" BACnet property.
     *
     * @param  {IBACnetObjectProperty} notif - notification object for outOfService
     * @return {void}
     */
    private shOutOfService (notif: IBACnetObjectProperty): void {
        const statusFlags = this.getProperty(BACnetPropIds.statusFlags);
        const statusFlagsPayload = statusFlags.payload as IBACnetTypeStatusFlags;

        const outOfServicePayload = notif.payload as IBACnetTypeBoolean;

        const newStatusFlags: IBACnetTypeStatusFlags = _.assign({}, statusFlagsPayload, {
            outOfService: !!outOfServicePayload.value,
        });

        this.setProperty({
            id: BACnetPropIds.statusFlags,
            payload: newStatusFlags,
        });
    }

    /**
     * shReliability - handles the changes of 'Reliability' property.
     * Method changes the "fault" field in "statusFlags" BACnet property.
     *
     * @param  {IBACnetObjectProperty} notif - notification object for reliability
     * @return {void}
     */
    private shReliability (notif: IBACnetObjectProperty): void {
        const statusFlags = this.getProperty(BACnetPropIds.statusFlags);
        const statusFlagsPayload = statusFlags.payload as IBACnetTypeStatusFlags;

        const reliabilityPayload = notif.payload as IBACnetTypeBoolean;

        const newStatusFlags: IBACnetTypeStatusFlags = _.assign({}, statusFlagsPayload, {
            fault: !!reliabilityPayload.value,
        });

        this.setProperty({
            id: BACnetPropIds.statusFlags,
            payload: newStatusFlags,
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
        const outOfService = this.getProperty(BACnetPropIds.outOfService);
        const outOfServicePayload = outOfService.payload as IBACnetTypeBoolean;

        if (outOfServicePayload.value) {
            return;
        }

        const polarity = this.getProperty(BACnetPropIds.polarity);
        const polarityPayload = outOfService.payload as IBACnetTypeEnumerated;
        const newValue = notif.payload as IBACnetTypeEnumerated;

        if (polarityPayload.value === newValue.value) {
            return;
        }

        this.updateProperty(polarity);

        const presentValue = this.getProperty(BACnetPropIds.presentValue);
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

        this.setProperty({
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
        this.dipatchCOVNotification();
    }

    /**
     * shStatusFlags - handles the changes of 'Status Flags' property.
     *
     * @param  {IBACnetObjectProperty} notif - notification object for statusFlags
     * @return {void}
     */
    private shStatusFlags (notif: IBACnetObjectProperty): void {
        const statusFlagsPayload = notif.payload as IBACnetTypeStatusFlags;
        const overridden = statusFlagsPayload.fault
            || statusFlagsPayload.outOfService
            || statusFlagsPayload.inAlarm;

        if (!!overridden === statusFlagsPayload.overridden) {
            this.dipatchCOVNotification();
            return;
        }

        const newStatusFlags: IBACnetTypeStatusFlags = _.assign({}, statusFlagsPayload, {
            overridden: !!overridden,
        });

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
