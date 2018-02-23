import * as _ from 'lodash';

import { OffsetUtil } from '../utils';

import { BACnetReaderUtil } from '../utils/bacnet-reader.util';

import { npdu, NPDU } from './npdu.layer';

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

        const NPDUMessage: Map<string, any> = this.npdu.getFromBuffer(buf);
        BLVCMessage.set('npdu', NPDUMessage);

        return BLVCMessage;
    }
}

export const blvc: BLVC = new BLVC(npdu);
