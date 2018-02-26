import {
    BACnetServiceTypes,
    BACnetPropIds,
    BLVCFunction,
} from '../core/enums';

import { RequestSocket, ResponseSocket } from '../core/sockets';

import { unconfirmReqPDU } from '../core/layers/apdus';
import { blvc, npdu } from '../core/layers';

import { BACnetWriterUtil } from '../core/utils';

export class UnconfirmReqService {

    /**
     * iAm - handles the "whoIs" request and sends a "iAm" response.
     *
     * @param  {RequestSocket} req - request object (socket)
     * @param  {ResponseSocket} resp - response object (socket)
     * @return {type}
     */
    public iAm (req: RequestSocket, resp: ResponseSocket) {
        const device = req.device.getDevice();

        // Generate APDU writer
        const writerUnconfirmReq = unconfirmReqPDU.writeReq({});
        const writerIAm = unconfirmReqPDU.writeIAm({
            objInst: device.id,
            objType: device.type,
            vendorId: device.vendorId,
        });
        const writerAPDU = BACnetWriterUtil.concat(writerUnconfirmReq, writerIAm);

        // Generate NPDU writer
        const writerNPDU = npdu.writeNPDULayer({
            control: {
                destSpecifier: true,
            },
            destNetworkAddress: 0xffff,
            hopCount: 0xff,
        });

        // Generate BLVC writer
        const writerBLVC = blvc.writeBLVCLayer({
            func: BLVCFunction.originalBroadcastNPDU,
            npdu: writerNPDU,
            apdu: writerAPDU,
        });

        // Concat messages
        const writerBACnet = BACnetWriterUtil.concat(writerBLVC, writerNPDU, writerAPDU);

        // Get and send BACnet message
        const msgBACnet = writerBACnet.getBuffer();
        return resp.sendBroadcast(msgBACnet);
    }

    /**
     * covNotification - handles the "COV notification" unconfirmed request.
     *
     * @param  {RequestSocket} req - request object (socket)
     * @param  {ResponseSocket} resp - response object (socket)
     * @return {type}
     */
    public covNotification (req: RequestSocket, resp: ResponseSocket) {
        const apduService = req.apdu.get('service');
        const subProcessId = apduService.get('subscriberProcessId');

        // Get object identifier
        const objIdent = apduService.get('objIdent');
        const objIdentValue = objIdent.get('value');
        const objType = objIdentValue.get('type');
        const objInst = objIdentValue.get('instance');

        // Get BACnet object (from device)
        const device = req.device.getDevice();
        const bnObject = req.device.getObject(objInst, objType);

        // Get value
        const bnProp = req.device.getProperty(bnObject, BACnetPropIds.presentValue);
        const bnStatus = req.device.getProperty(bnObject, BACnetPropIds.statusFlags);

        // Generate APDU writer
        const writerUnconfirmReq = unconfirmReqPDU.writeReq({});
        const writerCOVNotification = unconfirmReqPDU.writeCOVNotification({
            device: device,
            devObject: bnObject,
            prop: bnProp,
            status: bnStatus,
            processId: subProcessId,
        });
        const writerAPDU = BACnetWriterUtil.concat(writerUnconfirmReq, writerCOVNotification);

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
        return resp.send(msgBACnet);
    }
}

export const unconfirmReqService: UnconfirmReqService = new UnconfirmReqService();
