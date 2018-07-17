import * as _ from 'lodash';

import {
    // BACnetPropertyId,
    // BACnetEventState,
    BACnetUnitDataFlow,
} from '../../../../core/bacnet/enums';

import {
    UnitPropertyObject,
} from '../../../../core/interfaces';

import { IEDEUnit } from '../../../../core/interfaces';

import { StatusFlagsMiddleMetadata } from './status-flags.metadata';

import { MiddleUnit } from '../middle.unit';

//import * as BACNet.Types from '../../../../core/bacnet/types';
import * as BACNet from 'tid-bacnet-logic';

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
     * @param  {UnitPropertyObject} notif - notification object
     * @return {void}
     */
    public sjHandler (): void {
        this.storage.setFlowHandler(BACnetUnitDataFlow.Set, BACNet.Enums.PropertyId.eventState, (notif) => {
            this.shSetEventState(notif);
        });
        this.storage.setFlowHandler(BACnetUnitDataFlow.Set, BACNet.Enums.PropertyId.outOfService, (notif) => {
            this.shSetOutOfService(notif);
        });
        this.storage.setFlowHandler(BACnetUnitDataFlow.Set, BACNet.Enums.PropertyId.reliability, (notif) => {
            this.shSetReliability(notif);
        });
        this.storage.setFlowHandler(BACnetUnitDataFlow.Set, BACNet.Enums.PropertyId.statusFlags, (notif) => {
            this.shSetStatusFlags(notif);
        });
        this.storage.setFlowHandler(BACnetUnitDataFlow.Update, BACNet.Enums.PropertyId.statusFlags, (notif) => {
            this.shUpdateStatusFlags(notif);
        });
    }

    /**
     * shSetEventState - handles the changes of 'Event State' property.
     * - Method changes the "shSetEventState" field in "statusFlags" BACnet property.
     *
     * @param  {UnitPropertyObject} notif - notification object for eventState
     * @return {void}
     */
    private shSetEventState (notif: UnitPropertyObject): void {
        this.storage.updateProperty(notif);

        const statusFlagsProp = this.storage.getProperty(BACNet.Enums.PropertyId.statusFlags);
        const statusFlags = statusFlagsProp.payload as BACNet.Types.BACnetStatusFlags;

        const eventState = notif.payload as BACNet.Types.BACnetEnumerated;
        const newInAlarm = eventState.value !== BACNet.Enums.EventState.Normal;

        if (statusFlags.value.inAlarm === newInAlarm) {
            return;
        }

        const newStatusFlagsValue: BACNet.Interfaces.Type.StatusFlags = _.assign({}, statusFlags.value, {
            inAlarm: newInAlarm,
        });
        const newStatusFlags = new BACNet.Types.BACnetStatusFlags(newStatusFlagsValue);

        this.storage.setProperty({
            id: BACNet.Enums.PropertyId.statusFlags,
            payload: newStatusFlags,
        });
    }

    /**
     * shSetOutOfService - handles the changes of 'Out of Service' property.
     * - Method changes the "outOfService" field in "statusFlags" BACnet property.
     *
     * @param  {UnitPropertyObject} notif - notification object for outOfService
     * @return {void}
     */
    private shSetOutOfService (notif: UnitPropertyObject): void {
        this.storage.updateProperty(notif);

        const statusFlagsProp = this.storage.getProperty(BACNet.Enums.PropertyId.statusFlags);
        const statusFlags = statusFlagsProp.payload as BACNet.Types.BACnetStatusFlags;

        const outOfService = notif.payload as BACNet.Types.BACnetBoolean;

        const newStatusFlagsValue: BACNet.Interfaces.Type.StatusFlags = _.assign({}, statusFlags.value, {
            outOfService: !!outOfService.value,
        });
        const newStatusFlags = new BACNet.Types.BACnetStatusFlags(newStatusFlagsValue);

        this.storage.setProperty({
            id: BACNet.Enums.PropertyId.statusFlags,
            payload: newStatusFlags,
        });
    }

    /**
     * shSetReliability - handles the changes of 'Reliability' property.
     * - Method changes the "fault" field in "statusFlags" BACnet property.
     *
     * @param  {UnitPropertyObject} notif - notification object for reliability
     * @return {void}
     */
    private shSetReliability (notif: UnitPropertyObject): void {
        this.storage.updateProperty(notif);

        const statusFlagsProp = this.storage.getProperty(BACNet.Enums.PropertyId.statusFlags);
        const statusFlags = statusFlagsProp.payload as BACNet.Types.BACnetStatusFlags;

        const reliability = notif.payload as BACNet.Types.BACnetEnumerated;

        const newStatusFlagsValue: BACNet.Interfaces.Type.StatusFlags = _.assign({}, statusFlags.value, {
            fault: !!reliability.value,
        });
        const newStatusFlags = new BACNet.Types.BACnetStatusFlags(newStatusFlagsValue);

        this.storage.setProperty({
            id: BACNet.Enums.PropertyId.statusFlags,
            payload: newStatusFlags,
        });
    }

    /**
     * shSetStatusFlags - handles the changes of 'Status Flags' property.
     * - Method calculates the "overridden" status flag state and will set it if
     * old value does not equal to the calculated "overridden" state.
     *
     * @param  {UnitPropertyObject} notif - notification object for statusFlags
     * @return {void}
     */
    private shSetStatusFlags (notif: UnitPropertyObject): void {
        const statusFlagsProp = this.storage.getProperty(BACNet.Enums.PropertyId.statusFlags);
        const statusFlags = statusFlagsProp.payload as BACNet.Types.BACnetStatusFlags;

        const overridden = statusFlags.value.fault
            || statusFlags.value.outOfService
            || statusFlags.value.inAlarm;

        const newStatusFlagsValue: BACNet.Interfaces.Type.StatusFlags = _.assign({}, statusFlags.value, {
            overridden: !!overridden,
        });
        const newStatusFlags = new BACNet.Types.BACnetStatusFlags(newStatusFlagsValue);

        this.storage.updateProperty({
            id: BACNet.Enums.PropertyId.statusFlags,
            payload: newStatusFlags,
        });
    }

    /**
     * Handles the changes of 'Status Flags' property.
     * - Method emits `cov` event.
     *
     * @param  {UnitPropertyObject} notif - notification object for statusFlags
     * @return {void}
     */
    private shUpdateStatusFlags (notif: UnitPropertyObject): void {
        this.storage.dispatch();
    }
}
