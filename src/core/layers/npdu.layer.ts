import * as _ from 'lodash';

import { OffsetUtil, TyperUtil } from '../utils';

import { BACnetReaderUtil } from '../utils/bacnet-reader.util';

export class NPDU {
    public message: Map<string, any>;

    constructor () {
    }

    public setDataFromBuffer (buf: Buffer) {
        const readerUtil = new BACnetReaderUtil(buf);

        const mVersion = readerUtil.readUInt8();
        this.message.set('version', mVersion);

        const mControl = readerUtil.readUInt8();
        this.message.set('control', mControl);

        const destSpecifier = TyperUtil.getBit(mControl, 5);
        const srcSpecifier = TyperUtil.getBit(mControl, 3);

        if (destSpecifier) {
            const mNetworkAddress = readerUtil.readUInt16BE();
            this.message.set('destNetworkAddress', mNetworkAddress);

            const mMacAddressLen = readerUtil.readUInt8();
            this.message.set('destMacAddressLen', mMacAddressLen);

            const mMacAddress = readerUtil.readString('hex', mMacAddressLen);
            this.message.set('destMacAddress', mMacAddress);
        }

        if (srcSpecifier) {
            const mNetworkAddress = readerUtil.readUInt16BE();
            this.message.set('srcNetworkAddress', mNetworkAddress);

            const mMacAddressLen = readerUtil.readUInt8();
            this.message.set('srcMacAddressLen', mMacAddressLen);

            const mMacAddress = readerUtil.readString('hex', mMacAddressLen);
            this.message.set('srcMacAddress', mMacAddress);
        }

        if (destSpecifier) {
            const mHopCount = readerUtil.readUInt8();
            this.message.set('hopCount', mHopCount);
        }

        // return buf.slice(0, offset.getVaule());
    }
}
