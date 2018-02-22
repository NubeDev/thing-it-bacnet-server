import * as _ from 'lodash';

import {
    OffsetUtil,
    TyperUtil,
    BACnetReaderUtil,
    BACnetWriterUtil,
} from '../../utils';

import {
    BACNET_PROP_TYPES,
    BACNET_TAG_TYPES,
    BACNET_CONFIRMED_SERVICE,
    BACNET_UNCONFIRMED_SERVICE,
    BACNET_SERVICE_TYPES,
} from '../../enums';

import {
    ISimpleACK,
    ISimpleACKSubscribeCOV,
} from '../../interfaces';

export class SimpleACKPDU {
    constructor () {
    }

    public getFromBuffer (buf: Buffer): Map<string, any> {
        const reader = new BACnetReaderUtil(buf);
        const reqMap: Map<string, any> = new Map();

        // --- Read meta byte
        const mMeta = reader.readUInt8();

        const pduType = TyperUtil.getBitRange(mMeta, 4, 4);
        reqMap.set('type', pduType);

        // --- Read InvokeID byte
        const invokeId = reader.readUInt8();
        reqMap.set('invokeId', invokeId);

        const serviceChoice = reader.readUInt8();
        reqMap.set('serviceChoice', serviceChoice);

        let serviceMap;
        switch (serviceChoice) {
            case BACNET_CONFIRMED_SERVICE.SubscribeCOV:
                serviceMap = this.getSubscribeCOV(reader);
                break;
            case BACNET_CONFIRMED_SERVICE.WriteProperty:
                serviceMap = this.getWriteProperty(reader);
                break;
        }
        reqMap.set('service', serviceMap);

        return reqMap;
    }

    private getSubscribeCOV (reader: BACnetReaderUtil): Map<string, any> {
        const serviceMap: Map<string, any> = new Map();

        return serviceMap;
    }

    private getWriteProperty (reader: BACnetReaderUtil): Map<string, any> {
        const serviceMap: Map<string, any> = new Map();

        return serviceMap;
    }

    /**
     * writeReq - writes the massage for simple ack (header).
     *
     * @param  {ISimpleACK} params - SimpleACK params
     * @return {BACnetWriterUtil}
     */
    public writeReq (params: ISimpleACK): BACnetWriterUtil {
        const writer = new BACnetWriterUtil();

        // Write Service Type
        const mMeta = TyperUtil.setBitRange(0x00,
            BACNET_SERVICE_TYPES.SimpleACKPDU, 4, 4);
        writer.writeUInt8(mMeta);

        // Write InvokeID
        writer.writeUInt8(params.invokeId);

        return writer;
    }

    /**
     * writeSubscribeCOV - writes the message for SubscribeCOV service and
     * returns the instance of the writer utility.
     *
     * @param  {ISimpleACKSubscribeCOV} params - SubscribeCOV params
     * @return {BACnetWriterUtil}
     */
    public writeSubscribeCOV (params: ISimpleACKSubscribeCOV): BACnetWriterUtil {
        const writer = new BACnetWriterUtil();

        // Write Service choice
        writer.writeUInt8(BACNET_CONFIRMED_SERVICE.SubscribeCOV);

        return writer;
    }
}
