import * as Bluebird from 'bluebird';

import {
    BLVCFunction,
} from '../../core/enums';

import { complexACKPDU, simpleACKPDU } from '../../core/layers/apdus';
import { blvc, npdu } from '../../core/layers';

import { BACnetWriterUtil } from '../../core/utils';

import {
    IServiceSimpleACKSubscribeCOV,
    IServiceSimpleACKWriteProperty,
} from '../../core/interfaces';

import { OutputSocket } from '../../core/sockets';

export class SimpleACKService {
    private readonly className: string = 'SimpleACK';

    /**
     * subscribeCOV - sends the "subscribeCOV" simple ack request.
     *
     * @param  {IServiceSimpleACKSubscribeCOV} opts - request options
     * @param  {OutputSocket} outputSoc - output socket
     * @return {type}
     */
    public subscribeCOV (
            opts: IServiceSimpleACKSubscribeCOV, outputSoc: OutputSocket) {
        // Generate APDU writer
        const writerSimpleACKPDU = simpleACKPDU.writeReq(opts);
        const writerSubscribeCOV = simpleACKPDU.writeSubscribeCOV(opts);
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
        outputSoc.send(msgBACnet, `${this.className} - subscribeCOV`);
    }

    /**
     * writeProperty - sends the "writeProperty" simple ack request.
     *
     * @param  {IServiceSimpleACKWriteProperty} opts - request options
     * @param  {OutputSocket} outputSoc - output socket
     * @return {type}
     */
    public writeProperty (
            opts: IServiceSimpleACKWriteProperty, outputSoc: OutputSocket) {
        // Generate APDU writer
        const writerSimpleACKPDU = simpleACKPDU.writeReq(opts);
        const writerSubscribeCOV = simpleACKPDU.writeWriteProperty(opts);
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
        return outputSoc.send(msgBACnet, `${this.className} - writeProperty`);
    }
}

export const simpleACKService: SimpleACKService = new SimpleACKService();
