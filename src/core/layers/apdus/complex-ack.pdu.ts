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
    IComplexACK,
    IComplexACKReadProperty,
} from '../../interfaces';

export class ComplexACKPDU {
    constructor () {
    }

    private getFromBuffer (buf: Buffer): Map<string, any> {
        const reader = new BACnetReaderUtil(buf);
        const reqMap: Map<string, any> = new Map();

        // --- Read meta byte
        const mMeta = reader.readUInt8();

        const pduType = TyperUtil.getBitRange(mMeta, 4, 4);
        reqMap.set('type', pduType);

        const pduSeg = TyperUtil.getBit(mMeta, 3);
        reqMap.set('seg', pduSeg);

        const pduMor = TyperUtil.getBit(mMeta, 2);
        reqMap.set('mor', pduMor);

        // --- Read control byte
        const mControl = reader.readUInt8();

        const maxSegs = TyperUtil.getBitRange(mControl, 4, 3);
        reqMap.set('maxSegs', maxSegs);

        const maxResp = TyperUtil.getBitRange(mControl, 0, 4);
        reqMap.set('maxResp', maxResp);

        // --- Read InvokeID byte
        const invokeId = reader.readUInt8();
        reqMap.set('invokeId', invokeId);

        if (pduSeg) {
            const sequenceNumber = reader.readUInt8();
            reqMap.set('sequenceNumber', sequenceNumber);

            const proposedWindowSize = reader.readUInt8();
            reqMap.set('proposedWindowSize', proposedWindowSize);
        }

        const serviceChoice = reader.readUInt8();
        reqMap.set('serviceChoice', serviceChoice);

        let serviceMap;
        switch (serviceChoice) {
            case BACNET_CONFIRMED_SERVICE.ReadProperty:
                serviceMap = this.getReadProperty(reader);
                break;
        }
        reqMap.set('service', serviceMap);

        return reqMap;
    }

    private getReadProperty (reader: BACnetReaderUtil): Map<string, any> {
        const serviceMap: Map<string, any> = new Map();

        const objIdent = reader.readObjectIdentifier();
        serviceMap.set('objIdent', objIdent);

        const propIdent = reader.readProperty();
        serviceMap.set('propIdent', propIdent);

        const propValue = reader.readParamValue();
        serviceMap.set('propValue', propValue);

        return serviceMap;
    }

    /**
     * writeReq - writes the massage for complex ack (header).
     *
     * @param  {IComplexACK} params - ComplexACK params
     * @return {BACnetWriterUtil}
     */
    public writeReq (params: IComplexACK): BACnetWriterUtil {
        const writer = new BACnetWriterUtil();

        // Write service meta
        // Set service type
        let mMeta = TyperUtil.setBitRange(0x00,
            BACNET_SERVICE_TYPES.ComplexACKPDU, 4, 4);

        // Set service SEG flag
        if (!_.isNil(params.seg)) {
            mMeta = TyperUtil.setBit(mMeta, 3, params.seg);
        }

        // Set service MOR flag
        if (!_.isNil(params.mor)) {
            mMeta = TyperUtil.setBit(mMeta, 2, params.mor);
        }

        writer.writeUInt8(mMeta);

        // Write InvokeID
        writer.writeUInt8(params.invokeId);

        return writer;
    }

    /**
     * writeReadProperty - writes the message for ReadProperty service and
     * returns the instance of the writer utility.
     *
     * @param  {IComplexACKReadProperty} params - ReadProperty params
     * @return {BACnetWriterUtil}
     */
    public writeReadProperty (params: IComplexACKReadProperty): BACnetWriterUtil {
        const writer = new BACnetWriterUtil();

        // Write Service choice
        writer.writeUInt8(BACNET_CONFIRMED_SERVICE.ReadProperty);

        // Write Object identifier
        writer.writeTag(0, BACNET_TAG_TYPES.context, 4);
        writer.writeObjectIdentifier(params.objType, params.objInst);

        // Write PropertyID
        writer.writeTag(1, BACNET_TAG_TYPES.context, 1);
        writer.writeUInt8(params.propId);

        // Write PropertyID
        writer.writeValue(3, params.propType, params.propValue);

        return writer;
    }
}
