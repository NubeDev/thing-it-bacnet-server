import * as Bluebird from 'bluebird';

import {
    BLVCFunction,
} from '../../core/enums';

import { unconfirmReqPDU } from '../../core/layers/apdus';
import { blvc, npdu } from '../../core/layers';

import { BACnetWriterUtil } from '../../core/utils';

import {
    IServiceUnconfirmReqCOVNotification,
    IServiceUnconfirmReqWhoIs,
    IServiceUnconfirmReqIAm,
} from '../../core/interfaces';

import { OutputSocket } from '../../core/sockets';

export class UnconfirmedReqService {
    private readonly className: string = 'UnconfirmedReq';

    /**
     * whoIs - sends the "whoIs" request.
     *
     * @param  {IServiceUnconfirmReqWhoIs} opts - request options
     * @param  {OutputSocket} outputSoc - output socket
     * @return {type}
     */
    public whoIs (opts: IServiceUnconfirmReqWhoIs, outputSoc: OutputSocket) {
        // Generate APDU writer
        const writerUnconfirmReq = unconfirmReqPDU.writeReq(opts);
        const writerWhoIs = unconfirmReqPDU.writeWhoIs(opts);
        const writerAPDU = BACnetWriterUtil.concat(writerUnconfirmReq, writerWhoIs);

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
        return outputSoc.sendBroadcast(msgBACnet, `${this.className} - whoIs`);
    }

    /**
     * iAm - sends the "iAm" unconfirmed request.
     *
     * @param  {IServiceUnconfirmReqIAm} opts - request options
     * @param  {OutputSocket} outputSoc - output socket
     * @return {type}
     */
    public iAm (opts: IServiceUnconfirmReqIAm, outputSoc: OutputSocket) {
        // Generate APDU writer
        const writerUnconfirmReq = unconfirmReqPDU.writeReq(opts);
        const writerIAm = unconfirmReqPDU.writeIAm(opts);
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
        return outputSoc.sendBroadcast(msgBACnet, `${this.className} - iAm`);
    }

    /**
     * covNotification - sends the "COV notification" unconfirmed request.
     *
     * @param  {RequestSocket} req - request object (socket)
     * @param  {ResponseSocket} resp - response object (socket)
     * @return {type}
     */
    public covNotification (opts: IServiceUnconfirmReqCOVNotification, outputSoc: OutputSocket) {
        // Generate APDU writer
        const writerUnconfirmReq = unconfirmReqPDU.writeReq(opts);
        const writerCOVNotification = unconfirmReqPDU.writeCOVNotification(opts);
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
        outputSoc.send(msgBACnet, `${this.className} - covNotification`);
    }
}

export const unconfirmedReqService: UnconfirmedReqService = new UnconfirmedReqService();
