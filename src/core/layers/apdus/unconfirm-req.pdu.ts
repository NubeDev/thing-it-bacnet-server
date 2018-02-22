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
    BACNET_UNCONFIRMED_SERVICE,
    BACNET_SERVICE_TYPES,
} from '../../enums';

import {
    IUnconfirmReqIAm,
} from '../../interfaces';

export class UnconfirmReqPDU {
    constructor () {
    }

    public getFromBuffer (buf: Buffer): Map<string, any> {
        const reader = new BACnetReaderUtil(buf);
        const reqMap: Map<string, any> = new Map();

        // --- Read meta byte
        const mMeta = reader.readUInt8();

        const pduType = TyperUtil.getBitRange(mMeta, 4, 4);
        reqMap.set('type', pduType);

        const serviceChoice = reader.readUInt8();
        reqMap.set('serviceChoice', serviceChoice);

        let serviceMap;
        switch (serviceChoice) {
            case BACNET_UNCONFIRMED_SERVICE.iAm:
                serviceMap = this.getIAm(reader);
                break;
            case BACNET_UNCONFIRMED_SERVICE.whoIs:
                serviceMap = this.getWhoIs(reader);
                break;
        }
        reqMap.set('service', serviceMap);

        return reqMap;
    }

    private getIAm (reader: BACnetReaderUtil): Map<string, any> {
        const serviceMap: Map<string, any> = new Map();

        const objIdent = reader.readObjectIdentifier();
        serviceMap.set('objIdent', objIdent);

        const maxAPDUlength = reader.readParam();
        serviceMap.set('maxAPDUlength', maxAPDUlength);

        const segmentationSupported = reader.readParam();
        serviceMap.set('segmentationSupported', segmentationSupported);

        const vendorId = reader.readParam();
        serviceMap.set('vendorId', vendorId);

        return serviceMap;
    }

    private getWhoIs (reader: BACnetReaderUtil): Map<string, any> {
        const serviceMap: Map<string, any> = new Map();

        return serviceMap;
    }

    /**
     * writeReq - writes the massage for unconfirmed request (header).
     *
     * @return {BACnetWriterUtil}
     */
    public writeReq (): BACnetWriterUtil {
        const writer = new BACnetWriterUtil();

        // Write Service Type
        const mMeta = TyperUtil.setBitRange(0x00,
            BACNET_SERVICE_TYPES.UnconfirmedReqPDU, 4, 4);
        writer.writeUInt8(mMeta);

        return writer;
    }

    /**
     * writeIAm - writes the message for iAm service and returns the instance of
     * the writer utility.
     *
     * @param  {IUnconfirmReqIAm} params - iAm params
     * @return {BACnetWriterUtil}
     */
    public writeIAm (params: IUnconfirmReqIAm): BACnetWriterUtil {
        const writer = new BACnetWriterUtil();

        // Write Service choice
        writer.writeUInt8(BACNET_UNCONFIRMED_SERVICE.iAm);

        // Write Object identifier
        writer.writeTag(BACNET_PROP_TYPES.objectIdentifier,
            BACNET_TAG_TYPES.application, 4);
        writer.writeObjectIdentifier(params.objType, params.objInst);

        // Write maxAPDUlength (1476 chars)
        writer.writeTag(BACNET_PROP_TYPES.unsignedInt,
            BACNET_TAG_TYPES.application, 2);
        writer.writeUInt16BE(0x05c4);

        // Write Segmentation supported
        writer.writeTag(BACNET_PROP_TYPES.enumerated,
            BACNET_TAG_TYPES.application, 1);
        writer.writeUInt8(0x00);

        // Write Vendor ID
        writer.writeTag(BACNET_PROP_TYPES.unsignedInt,
            BACNET_TAG_TYPES.application, 1);
        writer.writeUInt8(params.vendorId);

        return writer;
    }
}
