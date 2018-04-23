import * as _ from 'lodash';

import { BACnetError } from '../../errors';

import {
    OffsetUtil,
    TyperUtil,
    BACnetReaderUtil,
    BACnetWriterUtil,
} from '../../utils';

import {
    IUnconfirmedReqLayer,
    IUnconfirmedReqService,
    IUnconfirmedReqIAmService,
    IUnconfirmedReqWhoIsService,
} from '../../interfaces';

import {
    BACnetPropTypes,
    BACnetPropertyId,
    BACnetTagTypes,
    BACnetUnconfirmedService,
    BACnetServiceTypes,
} from '../../enums';

import {
    IUnconfirmReq,
    IUnconfirmReqIAm,
    IUnconfirmReqCOVNotification,
    IUnconfirmReqWhoIs,
    IBACnetTypeObjectId,
} from '../../interfaces';

import {
    BACnetUnsignedInteger,
    BACnetObjectId,
    BACnetTypeBase,
} from '../../types';

export class UnconfirmedReqPDU {
    public readonly className: string = 'UnconfirmReqPDU';

    public getFromBuffer (buf: Buffer): IUnconfirmedReqLayer {
        const reader = new BACnetReaderUtil(buf);

        let reqMap: IUnconfirmedReqLayer;
        let serviceChoice: BACnetUnconfirmedService, serviceData: IUnconfirmedReqService;
        let pduType: number;

        try {
            // --- Read meta byte
            const mMeta = reader.readUInt8();

            pduType = TyperUtil.getBitRange(mMeta, 4, 4);

            serviceChoice = reader.readUInt8();

            switch (serviceChoice) {
                case BACnetUnconfirmedService.iAm:
                    serviceData = this.getIAm(reader);
                    break;
                case BACnetUnconfirmedService.whoIs:
                    serviceData = this.getWhoIs(reader);
                    break;
            }
        } catch (error) {
            throw new BACnetError(`${this.className} - getFromBuffer: Parse - ${error}`);
        }

        reqMap = {
            type: pduType,
            serviceChoice: serviceChoice,
            service: serviceData,
        };

        return reqMap;
    }

    private getIAm (reader: BACnetReaderUtil): IUnconfirmedReqIAmService {
        let serviceData: IUnconfirmedReqIAmService;
        let objId: BACnetObjectId,
            maxAPDUlength: BACnetUnsignedInteger,
            segmSupported: BACnetUnsignedInteger,
            vendorId: BACnetUnsignedInteger;

        try {
            objId = reader.readObjectIdentifier();

            maxAPDUlength = reader.readParam();

            segmSupported = reader.readParam();

            vendorId = reader.readParam();
        } catch (error) {
            throw new BACnetError(`${this.className} - getIAm: Parse - ${error}`);
        }

        serviceData = {
            objId: objId,
            maxAPDUlength: maxAPDUlength,
            segmSupported: segmSupported,
            vendorId: vendorId,
        };

        return serviceData;
    }

    private getWhoIs (reader: BACnetReaderUtil): IUnconfirmedReqWhoIsService {
        const serviceData: IUnconfirmedReqWhoIsService = {};

        return serviceData;
    }

    /**
     * writeReq - writes the massage for unconfirmed request (header).
     *
     * @param  {IUnconfirmReq} params - UnconfirmReq params
     * @return {BACnetWriterUtil}
     */
    public writeReq (params: IUnconfirmReq): BACnetWriterUtil {
        const writer = new BACnetWriterUtil();

        // Write Service Type
        const mMeta = TyperUtil.setBitRange(0x00,
            BACnetServiceTypes.UnconfirmedReqPDU, 4, 4);
        writer.writeUInt8(mMeta);

        return writer;
    }

    /**
     * writeWhoIs - writes the message for whoIs service and returns the instance of
     * the writer utility.
     *
     * @param  {IUnconfirmReqWhoIs} params - whoIs params
     * @return {BACnetWriterUtil}
     */
    public writeWhoIs (params: IUnconfirmReqWhoIs): BACnetWriterUtil {
        const writer = new BACnetWriterUtil();

        // Write Service choice
        writer.writeUInt8(BACnetUnconfirmedService.whoIs);

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
        writer.writeUInt8(BACnetUnconfirmedService.iAm);

        // Write Object identifier
        const objIdPayload = params.objId.payload as BACnetObjectId;
        writer.writeTag(BACnetPropTypes.objectIdentifier,
            BACnetTagTypes.application, 4);
        writer.writeObjectIdentifier(objIdPayload.getValue());

        // Write maxAPDUlength (1476 chars)
        writer.writeTag(BACnetPropTypes.unsignedInt,
            BACnetTagTypes.application, 2);
        writer.writeUInt16BE(0x05c4);

        // Write Segmentation supported
        writer.writeTag(BACnetPropTypes.enumerated,
            BACnetTagTypes.application, 1);
        writer.writeUInt8(0x00);

        // Write Vendor ID
        const propIdPayload = params.vendorId.payload as BACnetUnsignedInteger;
        writer.writeTag(BACnetPropTypes.unsignedInt,
            BACnetTagTypes.application, 1);
        writer.writeUInt8(propIdPayload.getValue());

        return writer;
    }

    /**
     * writeCOVNotification - writes the message for COVNotification service and
     * returns the instance of the writer utility.
     *
     * @param  {IUnconfirmReqCOVNotification} params - COVNotification params
     * @return {BACnetWriterUtil}
     */
    public writeCOVNotification (params: IUnconfirmReqCOVNotification): BACnetWriterUtil {
        const writer = new BACnetWriterUtil();

        // Write Service choice
        writer.writeUInt8(BACnetUnconfirmedService.covNotification);

        // Write Process Identifier
        writer.writeParam(params.processId.getValue(), 0);

        // Write Device Object Identifier
        writer.writeTag(1, BACnetTagTypes.context, 4);
        writer.writeObjectIdentifier(params.devObjId.getValue());

        // Write Object Identifier for device port
        writer.writeTag(2, BACnetTagTypes.context, 4);
        writer.writeObjectIdentifier(params.unitObjId.getValue());

        // Write timer remaining
        writer.writeParam(0x00, 3);

        // List of Values
        // Write opening tag for list of values
        writer.writeTag(4, BACnetTagTypes.context, 6);

        _.map(params.reportedProps, (reportedProp) => {
            // Write PropertyID
            writer.writeParam(reportedProp.id, 0);
            // Write PropertyValue
            writer.writeValue(2, reportedProp.payload);
        });

        // Write closing tag for list of values
        writer.writeTag(4, BACnetTagTypes.context, 7);

        return writer;
    }
}

export const unconfirmedReqPDU: UnconfirmedReqPDU = new UnconfirmedReqPDU();
