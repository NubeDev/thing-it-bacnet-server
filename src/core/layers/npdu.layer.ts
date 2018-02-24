import * as _ from 'lodash';

import {
    OffsetUtil,
    TyperUtil,
    BACnetReaderUtil,
    BACnetWriterUtil,
} from '../utils';

import { apdu, APDU } from './apdu.layer';

import {
    INPDULayer,
    INPDULayerControl,
} from '../interfaces';

export class NPDU {
    private apdu: APDU;

    constructor (apduInst: APDU) {
        this.apdu = apduInst;
    }

    private getControlFlags (mControl: number): Map<string, any> {
        const mControlMap: Map<string, any> = new Map();

        const noApduMessageType = !!TyperUtil.getBit(mControl, 7);
        mControlMap.set('noApduMessageType', noApduMessageType);

        const reserved1 = TyperUtil.getBit(mControl, 6);
        mControlMap.set('reserved1', reserved1);

        const destSpecifier = !!TyperUtil.getBit(mControl, 5);
        mControlMap.set('destSpecifier', destSpecifier);

        const reserved2 = TyperUtil.getBit(mControl, 4);
        mControlMap.set('reserved2', reserved2);

        const srcSpecifier = !!TyperUtil.getBit(mControl, 3);
        mControlMap.set('srcSpecifier', srcSpecifier);

        const expectingReply = !!TyperUtil.getBit(mControl, 2);
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

            if (mMacAddressLen) {
                const mMacAddress = readerUtil.readString('hex', mMacAddressLen);
                NPDUMessage.set('destMacAddress', mMacAddress);
            }
        }

        if (mControlMap.get('srcSpecifier')) {
            const mNetworkAddress = readerUtil.readUInt16BE();
            NPDUMessage.set('srcNetworkAddress', mNetworkAddress);

            const mMacAddressLen = readerUtil.readUInt8();
            NPDUMessage.set('srcMacAddressLen', mMacAddressLen);

            if (mMacAddressLen) {
                const mMacAddress = readerUtil.readString('hex', mMacAddressLen);
                NPDUMessage.set('srcMacAddress', mMacAddress);
            }
        }

        if (mControlMap.get('destSpecifier')) {
            const mHopCount = readerUtil.readUInt8();
            NPDUMessage.set('hopCount', mHopCount);
        }

        const APDUstart = readerUtil.offset.getVaule();
        const APDUbuffer = readerUtil.getRange(APDUstart);

        const APDUMessage: Map<string, any> = this.apdu.getFromBuffer(APDUbuffer);
        NPDUMessage.set('apdu', APDUMessage);

        return NPDUMessage;
    }

    /**
     * writeNPDULayer - writes the message for NPDU layer and returns the instance
     * of the writer utility.
     *
     * @param  {INPDULayer} params - NPDU layer params
     * @return {BACnetWriterUtil}
     */
    public writeNPDULayer (params: INPDULayer): BACnetWriterUtil {
        let writer = new BACnetWriterUtil();

        // Write Service choice
        writer.writeUInt8(0x01);

        const writerControl = this.writeNPDULayerControl(params.control);
        writer = BACnetWriterUtil.concat(writer, writerControl);

        if (_.get(params, 'control.destSpecifier')) {
            writer.writeUInt16BE(params.destNetworkAddress);

            const mMacAddressLen = _.get(params, 'destMacAddress', '').length;
            writer.writeUInt8(mMacAddressLen);

            if (mMacAddressLen) {
                writer.writeString(params.destMacAddress);
            }
        }

        if (_.get(params, 'control.srcSpecifier')) {
            writer.writeUInt16BE(params.srcNetworkAddress);

            const mMacAddressLen = _.get(params, 'srcMacAddress', '').length;
            writer.writeUInt8(mMacAddressLen);

            if (mMacAddressLen) {
                writer.writeString(params.srcMacAddress);
            }
        }

        if (_.isNumber(params.hopCount)) {
            writer.writeUInt8(params.hopCount);
        }

        return writer;
    }

    /**
     * writeNPDULayerControl - writes the message for NPDU layer control byte and
     * returns the instance of the writer utility.
     *
     * @param  {INPDULayerControl} params - NPDU layer control params
     * @return {BACnetWriterUtil}
     */
    public writeNPDULayerControl (params: INPDULayerControl): BACnetWriterUtil {
        const writer = new BACnetWriterUtil();

        // Write Service choice
        let control = 0x00;

        if (params) {
            control = params.noApduMessageType
                ? TyperUtil.setBit(control, 7, params.noApduMessageType) : control;

            control = params.destSpecifier
                ? TyperUtil.setBit(control, 5, params.destSpecifier) : control;

            control = params.srcSpecifier
                ? TyperUtil.setBit(control, 3, params.srcSpecifier) : control;

            control = params.expectingReply
                ? TyperUtil.setBit(control, 2, params.expectingReply) : control;

            control = _.isNumber(params.priority1)
                ? TyperUtil.setBit(control, 1, !!params.priority1) : control;

            control = _.isNumber(params.priority2)
                ? TyperUtil.setBit(control, 0, !!params.priority2) : control;
        }

        writer.writeUInt8(control);

        return writer;
    }
}

export const npdu: NPDU = new NPDU(apdu);
