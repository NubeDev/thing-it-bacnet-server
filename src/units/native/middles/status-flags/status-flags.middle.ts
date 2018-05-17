import * as _ from 'lodash';

import {
    BACnetPropertyId,
    BACnetEventState,
    BACnetUnitDataFlow,
} from '../../../../core/bacnet/enums';

import {
    IBACnetObjectProperty,
    IBACnetTypeStatusFlags,
} from '../../../../core/bacnet/interfaces';

import { IEDEUnit } from '../../../../core/interfaces';

import { StatusFlagsMiddleMetadata } from './status-flags.metadata';

import { MiddleUnit } from '../middle.unit';

import * as BACnetTypes from '../../../../core/bacnet/types';

export class StatusFlagsMiddleUnit extends MiddleUnit {
    public readonly className: string = 'StatusFlagsMiddleUnit';

    /**
     * initMiddle - initializes the middle unit.
     *
     * @param  {IEDEUnit} edeUnit -  ede unit configuration
     * @return {void}
     */
    public initMiddle (edeUnit?: IEDEUnit): void {
        super.initMiddle(edeUnit);

        this.storage.addUnitStorage(StatusFlagsMiddleMetadata);
    }

    /**
     * sjHandler - handles the changes of properties.
     *
     * @param  {IBACnetObjectProperty} notif - notification object
     * @return {void}
     */
    public sjHandler (): void {
        this.storage.setFlowHandler(BACnetUnitDataFlow.Set, BACnetPropertyId.eventState, (notif) => {
            this.shSetEventState(notif);
        });
        this.storage.setFlowHandler(BACnetUnitDataFlow.Set, BACnetPropertyId.outOfService, (notif) => {
            this.shSetOutOfService(notif);
        });
        this.storage.setFlowHandler(BACnetUnitDataFlow.Set, BACnetPropertyId.reliability, (notif) => {
            this.shSetReliability(notif);
        });
        this.storage.setFlowHandler(BACnetUnitDataFlow.Set, BACnetPropertyId.statusFlags, (notif) => {
            this.shSetStatusFlags(notif);
        });
        this.storage.setFlowHandler(BACnetUnitDataFlow.Update, BACnetPropertyId.statusFlags, (notif) => {
            this.shUpdateStatusFlags(notif);
        });
    }

    /**
     * shSetEventState - handles the changes of 'Event State' property.
     * - Method changes the "shSetEventState" field in "statusFlags" BACnet property.
     *
     * @param  {IBACnetObjectProperty} notif - notification object for eventState
     * @return {void}
     */
    private shSetEventState (notif: IBACnetObjectProperty): void {
        this.storage.updateProperty(notif);

        const statusFlagsProp = this.storage.getProperty(BACnetPropertyId.statusFlags);
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

        this.storage.setProperty({
            id: BACnetPropertyId.statusFlags,
            payload: newStatusFlags,
        });
    }

    /**
     * shSetOutOfService - handles the changes of 'Out of Service' property.
     * - Method changes the "outOfService" field in "statusFlags" BACnet property.
     *
     * @param  {IBACnetObjectProperty} notif - notification object for outOfService
     * @return {void}
     */
    private shSetOutOfService (notif: IBACnetObjectProperty): void {
        this.storage.updateProperty(notif);

        const statusFlagsProp = this.storage.getProperty(BACnetPropertyId.statusFlags);
        const statusFlags = statusFlagsProp.payload as BACnetTypes.BACnetStatusFlags;

        const outOfService = notif.payload as BACnetTypes.BACnetBoolean;

        const newStatusFlagsValue: IBACnetTypeStatusFlags = _.assign({}, statusFlags.value, {
            outOfService: !!outOfService.value,
        });
        const newStatusFlags = new BACnetTypes.BACnetStatusFlags(newStatusFlagsValue);

        this.storage.setProperty({
            id: BACnetPropertyId.statusFlags,
            payload: newStatusFlags,
        });
    }

    /**
     * shSetReliability - handles the changes of 'Reliability' property.
     * - Method changes the "fault" field in "statusFlags" BACnet property.
     *
     * @param  {IBACnetObjectProperty} notif - notification object for reliability
     * @return {void}
     */
    private shSetReliability (notif: IBACnetObjectProperty): void {
        this.storage.updateProperty(notif);

        const statusFlagsProp = this.storage.getProperty(BACnetPropertyId.statusFlags);
        const statusFlags = statusFlagsProp.payload as BACnetTypes.BACnetStatusFlags;

        const reliability = notif.payload as BACnetTypes.BACnetEnumerated;

        const newStatusFlagsValue: IBACnetTypeStatusFlags = _.assign({}, statusFlags.value, {
            fault: !!reliability.value,
        });
        const newStatusFlags = new BACnetTypes.BACnetStatusFlags(newStatusFlagsValue);

        this.storage.setProperty({
            id: BACnetPropertyId.statusFlags,
            payload: newStatusFlags,
        });
    }

    /**
     * shSetStatusFlags - handles the changes of 'Status Flags' property.
     * - Method calculates the "overridden" status flag state and will set it if
     * old value does not equal to the calculated "overridden" state.
     *
     * @param  {IBACnetObjectProperty} notif - notification object for statusFlags
     * @return {void}
     */
    private shSetStatusFlags (notif: IBACnetObjectProperty): void {
        const statusFlagsProp = this.storage.getProperty(BACnetPropertyId.statusFlags);
        const statusFlags = statusFlagsProp.payload as BACnetTypes.BACnetStatusFlags;

        const overridden = statusFlags.value.fault
            || statusFlags.value.outOfService
            || statusFlags.value.inAlarm;

        const newStatusFlagsValue: IBACnetTypeStatusFlags = _.assign({}, statusFlags.value, {
            overridden: !!overridden,
        });
        const newStatusFlags = new BACnetTypes.BACnetStatusFlags(newStatusFlagsValue);

        this.storage.updateProperty({
            id: BACnetPropertyId.statusFlags,
            payload: newStatusFlags,
        });
    }

    /**
     * Handles the changes of 'Status Flags' property.
     * - Method emits `cov` event.
     *
     * @param  {IBACnetObjectProperty} notif - notification object for statusFlags
     * @return {void}
     */
    private shUpdateStatusFlags (notif: IBACnetObjectProperty): void {
        this.storage.dispatch();
    }
}
