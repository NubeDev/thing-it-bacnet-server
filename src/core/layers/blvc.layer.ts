import * as _ from 'lodash';

import {
    OffsetUtil,
    TyperUtil,
    BACnetReaderUtil,
    BACnetWriterUtil,
} from '../utils';

import { npdu, NPDU } from './npdu.layer';

import {
    IBLVCLayer,
} from '../interfaces';

export class BLVC {
    private npdu: NPDU;

    constructor (npduInst: NPDU) {
        this.npdu = npduInst;
    }

    public getFromBuffer (buf: Buffer): Map<string, any> {
        const readerUtil = new BACnetReaderUtil(buf);

        const BLVCMessage: Map<string, any> = new Map();

        const mType = readerUtil.readUInt8();
        BLVCMessage.set('type', mType);

        const mFunction = readerUtil.readUInt8();
        BLVCMessage.set('function', mFunction);

        const mLenght = readerUtil.readUInt16BE();
        BLVCMessage.set('lenght', mLenght);

        const NPDUstart = readerUtil.offset.getVaule();
        const NPDUbuffer = readerUtil.getRange(NPDUstart, mLenght);

        const NPDUMessage: Map<string, any> = this.npdu.getFromBuffer(NPDUbuffer);
        BLVCMessage.set('npdu', NPDUMessage);

        return BLVCMessage;
    }

    /**
     * writeBLVCLayer - writes the message for BLVC layer and
     * returns the instance of the writer utility.
     *
     * @param  {IBLVCLayer} params - BLVC layer params
     * @return {BACnetWriterUtil}
     */
    public writeBLVCLayer (params: IBLVCLayer): BACnetWriterUtil {
        let writer = new BACnetWriterUtil();

        // Write BLVC type
        writer.writeUInt8(0x81);

        // Write BLVC function
        writer.writeUInt8(params.func);

        // Write message size
        const apduSize = params.apdu.size;
        const npduSize = params.npdu.size;
        const blvcSize = writer.size + 2;
        const sumSize = blvcSize + npduSize + apduSize;
        writer.writeUInt16BE(sumSize);

        return writer;
    }
}

export const blvc: BLVC = new BLVC(npdu);
