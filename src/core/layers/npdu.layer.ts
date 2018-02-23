import * as _ from 'lodash';

import { OffsetUtil, TyperUtil } from '../utils';

import { BACnetReaderUtil } from '../utils/bacnet-reader.util';

import { apdu, APDU } from './apdu.layer';

export class NPDU {
    private apdu: APDU;

    constructor (apduInst: APDU) {
        this.apdu = apduInst;
    }

    private getControlFlags (mControl: number): Map<string, any> {
        const mControlMap: Map<string, any> = new Map();

        const noApduMessageType = TyperUtil.getBit(mControl, 7);
        mControlMap.set('noApduMessageType', noApduMessageType);

        const reserved1 = TyperUtil.getBit(mControl, 6);
        mControlMap.set('reserved1', reserved1);

        const destSpecifier = TyperUtil.getBit(mControl, 5);
        mControlMap.set('destSpecifier', destSpecifier);

        const reserved2 = TyperUtil.getBit(mControl, 4);
        mControlMap.set('reserved2', reserved2);

        const srcSpecifier = TyperUtil.getBit(mControl, 3);
        mControlMap.set('srcSpecifier', srcSpecifier);

        const expectingReply = TyperUtil.getBit(mControl, 2);
        mControlMap.set('expectingReply', expectingReply);

        const priority1 = TyperUtil.getBit(mControl, 1);
        mControlMap.set('priority1', priority1);

        const priority2 = TyperUtil.getBit(mControl, 0);
        mControlMap.set('priority2', priority2);

        return mControlMap;
    }

    public getFromBuffer (buf: Buffer): Map<string, any> {
        const readerUtil = new BACnetReaderUtil(buf);

        const NPDUMessage: Map<string, any> = new Map();

        const mVersion = readerUtil.readUInt8();
        NPDUMessage.set('version', mVersion);

        const mControl = readerUtil.readUInt8();
        const mControlMap = this.getControlFlags(mControl);
        NPDUMessage.set('control', mControlMap);

        if (mControlMap.get('destSpecifier')) {
            const mNetworkAddress = readerUtil.readUInt16BE();
            NPDUMessage.set('destNetworkAddress', mNetworkAddress);

            const mMacAddressLen = readerUtil.readUInt8();
            NPDUMessage.set('destMacAddressLen', mMacAddressLen);

            const mMacAddress = readerUtil.readString('hex', mMacAddressLen);
            NPDUMessage.set('destMacAddress', mMacAddress);
        }

        if (mControlMap.get('srcSpecifier')) {
            const mNetworkAddress = readerUtil.readUInt16BE();
            NPDUMessage.set('srcNetworkAddress', mNetworkAddress);

            const mMacAddressLen = readerUtil.readUInt8();
            NPDUMessage.set('srcMacAddressLen', mMacAddressLen);

            const mMacAddress = readerUtil.readString('hex', mMacAddressLen);
            NPDUMessage.set('srcMacAddress', mMacAddress);
        }

        if (mControlMap.get('destSpecifier')) {
            const mHopCount = readerUtil.readUInt8();
            NPDUMessage.set('hopCount', mHopCount);
        }

        const APDUstart = readerUtil.offset.getVaule();
        const APDUbuffer = readerUtil.getRange(APDUstart);

        const APDUMessage: Map<string, any> = this.apdu.getFromBuffer(buf);
        NPDUMessage.set('apdu', APDUMessage);

        return NPDUMessage;
    }
}

export const npdu: NPDU = new NPDU(apdu);
