import * as Bluebird from 'bluebird';

import {
    BACnetServiceTypes,
    BLVCFunction,
} from '../../core/enums';

import { complexACKPDU, simpleACKPDU } from '../../core/layers/apdus';
import { blvc, npdu } from '../../core/layers';

import { BACnetWriterUtil } from '../../core/utils';

import {
    IConfirmedReqLayer,
    IConfirmedReqSubscribeCOVService,
    IConfirmedReqWritePropertyService,
    IBACnetTypeObjectId,
    IBACnetTypeUnsignedInt,
} from '../../core/interfaces';

import { InputSocket, OutputSocket, ServiceSocket } from '../../core/sockets';

import { UnitStorageManager } from '../../managers/unit-storage.manager';
import { unconfirmedReqService } from './unconfirmed-req.service';

export class SimpleACKService {
    /**
     * subscribeCOV - handles the "subscribeCOV" confirmed request.
     *
     * @param  {RequestSocket} req - request object (socket)
     * @param  {ResponseSocket} resp - response object (socket)
     * @return {type}
     */
    public subscribeCOV (
            inputSoc: InputSocket, outputSoc: OutputSocket, serviceSocket: ServiceSocket) {
        const apduMessage = inputSoc.apdu as IConfirmedReqLayer;
        const invokeId = apduMessage.invokeId;
        const apduService = apduMessage.service as IConfirmedReqSubscribeCOVService;
        const unitManager: UnitStorageManager = serviceSocket.getService('unitManager');

        // Get object identifier
        const objId = apduService.objId;
        const objIdPayload = objId.payload as IBACnetTypeObjectId;

        // Generate APDU writer
        const writerSimpleACKPDU = simpleACKPDU.writeReq({
            invokeId: invokeId
        });
        const writerSubscribeCOV = simpleACKPDU.writeSubscribeCOV({});
        const writerAPDU = BACnetWriterUtil.concat(writerSimpleACKPDU, writerSubscribeCOV);

        // Generate NPDU writer
        const writerNPDU = npdu.writeNPDULayer({});

        // Generate BLVC writer
        const writerBLVC = blvc.writeBLVCLayer({
            func: BLVCFunction.originalUnicastNPDU,
            npdu: writerNPDU,
            apdu: writerAPDU,
        });

        // Concat messages
        const writerBACnet = BACnetWriterUtil.concat(writerBLVC, writerNPDU, writerAPDU);

        // Get and send BACnet message
        const msgBACnet = writerBACnet.getBuffer();
        outputSoc.send(msgBACnet, 'subscribeCOV')
        unconfirmedReqService.covNotification(inputSoc, outputSoc, serviceSocket);
        unitManager
            .subscribeToUnit(objIdPayload)
            .subscribe(() => {
                unconfirmedReqService.covNotification(inputSoc, outputSoc, serviceSocket);
            });
    }

    /**
     * writeProperty - handles the "writeProperty" confirmed request.
     *
     * @param  {RequestSocket} req - request object (socket)
     * @param  {ResponseSocket} resp - response object (socket)
     * @return {type}
     */
    public writeProperty (
            inputSoc: InputSocket, outputSoc: OutputSocket, serviceSocket: ServiceSocket) {
        const apduMessage = inputSoc.apdu as IConfirmedReqLayer;
        const invokeId = apduMessage.invokeId;
        const apduService = apduMessage.service as IConfirmedReqWritePropertyService;

        // Get object identifier
        const objId = apduService.objId;
        const objIdPayload = objId.payload as IBACnetTypeObjectId;

        // Get property ID
        const propId = apduService.propId;
        const propIdPayload = propId.payload as IBACnetTypeUnsignedInt;

        // Get property value
        const propValues = apduService.propValues;
        const propValuePayload = propValues[0].payload;

        const unitManager: UnitStorageManager = serviceSocket.getService('unitManager');
        unitManager.setUnitProperty(objIdPayload, propIdPayload.value, propValuePayload);

        // Generate APDU writer
        const writerSimpleACKPDU = simpleACKPDU.writeReq({
            invokeId: invokeId,
        });
        const writerSubscribeCOV = simpleACKPDU.writeWriteProperty({});
        const writerAPDU = BACnetWriterUtil.concat(writerSimpleACKPDU, writerSubscribeCOV);

        // Generate NPDU writer
        const writerNPDU = npdu.writeNPDULayer({});

        // Generate BLVC writer
        const writerBLVC = blvc.writeBLVCLayer({
            func: BLVCFunction.originalUnicastNPDU,
            npdu: writerNPDU,
            apdu: writerAPDU,
        });

        // Concat messages
        const writerBACnet = BACnetWriterUtil.concat(writerBLVC, writerNPDU, writerAPDU);

        // Get and send BACnet message
        const msgBACnet = writerBACnet.getBuffer();
        return outputSoc.send(msgBACnet, 'writeProperty');
    }
}

export const simpleACKService: SimpleACKService = new SimpleACKService();
