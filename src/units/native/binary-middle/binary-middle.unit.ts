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

import { BinaryMiddleMetadata } from './binary-middle.metadata';

import { NativeUnit } from '../native.unit';

import * as BACnetTypes from '../../../core/utils/types';

export class BinaryMiddleUnit extends NativeUnit {
    public readonly className: string = 'BinaryMiddleUnit';

    constructor (edeUnit: IEDEUnit, unitMetadata: IBACnetObjectProperty[]) {
        super(edeUnit, BinaryMiddleMetadata);

        _.map(unitMetadata, (prop) => {
            this.metadata.set(prop.id, prop);
        });
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
            case BACnetPropIds.eventState:
                this.updateProperty(notif);
                this.shEventState(notif);
                return;
            case BACnetPropIds.outOfService:
                this.updateProperty(notif);
                this.shOutOfService(notif);
                return;
            case BACnetPropIds.reliability:
                this.updateProperty(notif);
                this.shReliability(notif);
                return;
            case BACnetPropIds.statusFlags:
                this.shStatusFlags(notif);
                return;
        }
        return true;
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
