import * as _ from 'lodash';

import { OffsetUtil, TyperUtil } from '../utils';

export class NPDU {
    public message: Map<string, any>;

    constructor () {
    }

    public setDataByBuffer (buf: Buffer) {
        const offset = new OffsetUtil(0);

        const mVersion = buf.readUInt8(offset.inc());
        this.message.set('version', mVersion);

        const mControl = buf.readUInt8(offset.inc());
        this.message.set('control', mControl);

        const destSpecifier = TyperUtil.getBit(mControl, 5);
        const srcSpecifier = TyperUtil.getBit(mControl, 3);

        if (destSpecifier) {
            const mNetworkAddress = buf.readInt16BE(offset.inc(2));
            this.message.set('destNetworkAddress', mNetworkAddress);

            const mMacAddressLen = buf.readUInt8(offset.inc());
            this.message.set('destMacAddressLen', mMacAddressLen);

            const start = offset.inc(mMacAddressLen);
            const end = offset.getVaule();
            const mMacAddress = buf.toString('hex', start, end);
            this.message.set('destMacAddress', mMacAddress);
        }

        if (srcSpecifier) {
            const mNetworkAddress = buf.readInt16BE(offset.inc(2));
            this.message.set('srcNetworkAddress', mNetworkAddress);

            const mMacAddressLen = buf.readUInt8(offset.inc());
            this.message.set('srcMacAddressLen', mMacAddressLen);

            const start = offset.inc(mMacAddressLen);
            const end = offset.getVaule();
            const mMacAddress = buf.toString('hex', start, end);
            this.message.set('srcMacAddress', mMacAddress);
        }

        if (destSpecifier) {
            const mHopCount = buf.readUInt8(offset.inc());
            this.message.set('hopCount', mHopCount);
        }

        return buf.slice(0, offset.getVaule());
    }
}
