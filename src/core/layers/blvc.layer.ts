import * as _ from 'lodash';

import { OffsetUtil } from '../utils';

import { BACnetReaderUtil } from '../utils/bacnet-reader.util';

export class BLVC {
    public message: Map<string, any>;

    constructor () {
    }

    public setDataFromBuffer (buf: Buffer) {
        const readerUtil = new BACnetReaderUtil(buf);

        const mType = readerUtil.readUInt8();
        this.message.set('type', mType);

        const mFunction = readerUtil.readUInt8();
        this.message.set('function', mFunction);

        const mLenght = readerUtil.readUInt16BE();
        this.message.set('lenght', mLenght);

        // return buf.slice(0, offset.getVaule());
    }
}
