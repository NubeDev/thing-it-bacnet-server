import * as _ from 'lodash';

import { OffsetUtil } from '../utils';

export class BLVC {
    public message: Map<string, any>;

    constructor () {
    }

    public setDataByBuffer (buf: Buffer) {
        const offset = new OffsetUtil(0);

        const mType = buf.readUInt8(offset.inc());
        this.message.set('type', mType);

        const mFunction = buf.readUInt8(offset.inc());
        this.message.set('function', mFunction);

        const mLenght = buf.readUInt16BE(offset.inc(2));
        this.message.set('lenght', mLenght);

        return buf.slice(0, offset.getVaule());
    }
}
