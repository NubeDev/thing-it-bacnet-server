import * as Bluebird from 'bluebird';

import {
    BACnetServiceTypes,
    BLVCFunction,
    BACnetPropIds,
} from '../core/enums';

import { complexACKPDU, simpleACKPDU } from '../core/layers/apdus';
import { blvc, npdu } from '../core/layers';

import { BACnetWriterUtil } from '../core/utils';

import {
    IConfirmedReqLayer,
    IConfirmedReqSubscribeCOVService,
    IConfirmedReqWritePropertyService,
    IConfirmedReqReadPropertyService,
    IBACnetTypeObjectId,
    IBACnetTypeUnsignedInt,
} from '../core/interfaces';

import { InputSocket, OutputSocket, ServiceSocket } from '../core/sockets';

import { UnitStorageManager } from '../managers/unit-storage.manager';

import { unconfirmedReqService, simpleACKService, complexACKService } from './bacnet';

export class UnitConfirmedReqService {

    /**
     * readProperty - handles the "readProperty" confirmed request.
     *
     * @param  {RequestSocket} req - request object (socket)
     * @param  {ResponseSocket} resp - response object (socket)
     * @return {Bluebird<any>}
     */
    public readProperty (inputSoc: InputSocket, outputSoc: OutputSocket,
            serviceSocket: ServiceSocket): Bluebird<any> {
        const apduMessage = inputSoc.apdu as IConfirmedReqLayer;
        const apduService = apduMessage.service as IConfirmedReqReadPropertyService;

        const invokeId = apduMessage.invokeId;

        // Get object identifier
        const unitObjId = apduService.objId;
        const unitObjIdPayload = unitObjId.payload as IBACnetTypeObjectId;

        // Get property identifier
        const propId = apduService.propId;
        const propIdPayload = propId.payload as IBACnetTypeUnsignedInt;

        // Get BACnet property (for BACnet object)
        const unitStorage: UnitStorageManager = serviceSocket.getService('unitStorage');
        const unitProp = unitStorage.getUnitProperty(unitObjIdPayload, propIdPayload.value);

        complexACKService.readProperty({
            invokeId: invokeId,
            unitObjId: unitObjIdPayload,
            unitProp: unitProp,
        }, outputSoc);

        return Bluebird.resolve();
    }

    /**
     * subscribeCOV - handles the "subscribeCOV" confirmed request.
     * Method sends the "subscribeCOV" simple ack response and subscribe on the
     * COV notification for specific BACnet object (unit).
     *
     * @param  {RequestSocket} req - request object (socket)
     * @param  {ResponseSocket} resp - response object (socket)
     * @return {Bluebird<any>}
     */
    public subscribeCOV (inputSoc: InputSocket, outputSoc: OutputSocket,
            serviceSocket: ServiceSocket): Bluebird<any> {
        const apduMessage = inputSoc.apdu as IConfirmedReqLayer;
        const apduService = apduMessage.service as IConfirmedReqSubscribeCOVService;
        const unitStorage: UnitStorageManager = serviceSocket.getService('unitStorage');

        // --- Sends response "subscribeCOV"

        // Get invoke ID
        const invokeId = apduMessage.invokeId;

        simpleACKService.subscribeCOV({
            invokeId: invokeId
        }, outputSoc);

        // --- Sends response "covNotification"

        // Get process ID
        const subProcessId = apduService.subscriberProcessId;
        const subProcessIdPayload = subProcessId.payload as IBACnetTypeUnsignedInt;

        // Get unit Object identifier
        const unitObjId = apduService.objId;
        const unitObjIdPayload = unitObjId.payload as IBACnetTypeObjectId;

        // Get device Object identifier
        const device = unitStorage.getDevice();
        const devObjId = device.getProperty(BACnetPropIds.objectIdentifier);
        const devObjIdPayload = devObjId.payload as IBACnetTypeObjectId;

        unitStorage
            .subscribeToUnit(unitObjIdPayload)
            .subscribe((reportedProps) => {
                unconfirmedReqService.covNotification({
                    processId: subProcessIdPayload,
                    devObjId: devObjIdPayload,
                    unitObjId: unitObjIdPayload,
                    reportedProps: reportedProps,
                }, outputSoc);
            });

        return Bluebird.resolve();
    }

    /**
     * writeProperty - handles the "writeProperty" confirmed request.
     * Method sends the "writeProperty" simple ack response.
     *
     * @param  {RequestSocket} req - request object (socket)
     * @param  {ResponseSocket} resp - response object (socket)
     * @return {Bluebird<any>}
     */
    public writeProperty (inputSoc: InputSocket, outputSoc: OutputSocket,
            serviceSocket: ServiceSocket): Bluebird<any> {
        const apduMessage = inputSoc.apdu as IConfirmedReqLayer;
        const apduService = apduMessage.service as IConfirmedReqWritePropertyService;
        const invokeId = apduMessage.invokeId;

        // Get unit Object identifier
        const objId = apduService.objId;
        const objIdPayload = objId.payload as IBACnetTypeObjectId;

        // Get property ID
        const propId = apduService.propId;
        const propIdPayload = propId.payload as IBACnetTypeUnsignedInt;

        // Get property value
        const propValues = apduService.propValues;
        const propValuePayload = propValues[0].payload;

        const unitStorage: UnitStorageManager = serviceSocket.getService('unitStorage');
        unitStorage.setUnitProperty(objIdPayload, propIdPayload.value, propValuePayload);

        simpleACKService.writeProperty({
            invokeId: invokeId,
        }, outputSoc);

        return Bluebird.resolve();
    }
}

export const unitConfirmedReqService: UnitConfirmedReqService = new UnitConfirmedReqService();
