import {
    BACnetServiceTypes,
    BLVCFunction,
} from '../core/enums';

import { RequestSocket, ResponseSocket } from '../core/sockets';

import { complexACKPDU, simpleACKPDU } from '../core/layers/apdus';
import { blvc, npdu } from '../core/layers';

import { BACnetWriterUtil } from '../core/utils';

import { unconfirmReqService } from './unconfirm-req.service';

export class SimpleACKService {

    /**
     * subscribeCOV - handles the "subscribeCOV" confirmed request.
     *
     * @param  {RequestSocket} req - request object (socket)
     * @param  {ResponseSocket} resp - response object (socket)
     * @return {type}
     */
    public subscribeCOV (req: RequestSocket, resp: ResponseSocket) {
        const invokeId = req.apdu.get('invokeId');
        const apduService = req.apdu.get('service');

        // Get object identifier
        const objIdent = apduService.get('objIdent');
        const objIdentValue = objIdent.get('value');
        const objType = objIdentValue.get('type');
        const objInst = objIdentValue.get('instance');

        // Get BACnet object (from module)
        const bnObject = req.device.getObject(objInst, objType);

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
        return resp.send(msgBACnet)
            .then(() => {
                req.device.subscribe(bnObject.id, bnObject.type, () => {
                    unconfirmReqService.covNotification(req, resp);
                });
            });
    }

    /**
     * writeProperty - handles the "writeProperty" confirmed request.
     *
     * @param  {RequestSocket} req - request object (socket)
     * @param  {ResponseSocket} resp - response object (socket)
     * @return {type}
     */
    public writeProperty (req: RequestSocket, resp: ResponseSocket) {
        const invokeId = req.apdu.get('invokeId');
        const apduService = req.apdu.get('service');

        // Get object identifier
        const objIdent = apduService.get('objIdent');
        const objIdentValue = objIdent.get('value');
        const objType = objIdentValue.get('type');
        const objInst = objIdentValue.get('instance');

        // Get BACnet object (from module)
        const bnObject = req.device.getObject(objInst, objType);

        // ----- TODO: Set the new property. Check code.
        const propIdent = apduService.get('propIdent');
        const propIdentValue = objIdent.get('value');

        const propValue = apduService.get('propValue');
        const propValueValue = objIdent.get('value');

        req.device.setPropertyValue(bnObject.id, bnObject.type,
            propIdentValue, propValueValue);

        req.device.next(bnObject.id, bnObject.type);

        // Generate APDU writer
        const writerSimpleACKPDU = simpleACKPDU.writeReq({
            invokeId: invokeId
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
        return resp.send(msgBACnet);
    }
}

export const simpleACKService: SimpleACKService = new SimpleACKService();
