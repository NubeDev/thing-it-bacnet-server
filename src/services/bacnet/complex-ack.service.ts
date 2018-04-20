import * as Bluebird from 'bluebird';

import {
    BLVCFunction,
} from '../../core/enums';

import { complexACKPDU } from '../../core/layers/apdus';
import { blvc, npdu } from '../../core/layers';

import { BACnetWriterUtil } from '../../core/utils';

import {
    IServiceComplexACKReadProperty,
} from '../../core/interfaces';

import { OutputSocket } from '../../core/sockets';

export class ComplexACKService {
    private readonly className: string = 'ComplexACK';

    /**
     * readProperty - sends the "readProperty" complex ack request.
     *
     * @param  {IServiceComplexACKReadProperty} opts - request options
     * @param  {OutputSocket} outputSoc - output socket
     * @return {type}
     */
    public readProperty (opts: IServiceComplexACKReadProperty, outputSoc: OutputSocket) {
        // Generate APDU writer
        const writerComplexACK = complexACKPDU.writeReq(opts);
        const writerReadProperty = complexACKPDU.writeReadProperty(opts);
        const writerAPDU = BACnetWriterUtil.concat(writerComplexACK, writerReadProperty);

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
        outputSoc.send(msgBACnet, `${this.className} - readProperty`);

        return Bluebird.resolve();
    }
}

export const complexACKService: ComplexACKService = new ComplexACKService();
