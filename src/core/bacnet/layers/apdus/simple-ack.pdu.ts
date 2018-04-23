import * as _ from 'lodash';

import { BACnetError } from '../../errors';

import {
    OffsetUtil,
    TyperUtil,
    BACnetReaderUtil,
    BACnetWriterUtil,
} from '../../utils';

import {
    ILayerSimpleACK,
    ILayerSimpleACKService,
    ILayerSimpleACKServiceSubscribeCOV,
    ILayerSimpleACKServiceWriteProperty,
} from '../../interfaces';

import {
    IWriteSimpleACK,
    IWriteSimpleACKSubscribeCOV,
    IWriteSimpleACKWriteProperty,
} from '../../interfaces';

import {
    BACnetPropTypes,
    BACnetTagTypes,
    BACnetConfirmedService,
    BACnetServiceTypes,
} from '../../enums';

import {
    BACnetUnsignedInteger,
    BACnetObjectId,
    BACnetTypeBase,
} from '../../types';

export class SimpleACKPDU {
    public readonly className: string = 'SimpleACKPDU';

    public getFromBuffer (buf: Buffer): ILayerSimpleACK {
        const reader = new BACnetReaderUtil(buf);

        let reqMap: ILayerSimpleACK;
        let serviceChoice: BACnetConfirmedService, serviceData: ILayerSimpleACKService;
        let pduType: number, invokeId: number;

        try {
            // --- Read meta byte
            const mMeta = reader.readUInt8();

            pduType = TyperUtil.getBitRange(mMeta, 4, 4);

            // --- Read InvokeID byte
            invokeId = reader.readUInt8();

            serviceChoice = reader.readUInt8();

            switch (serviceChoice) {
                case BACnetConfirmedService.SubscribeCOV:
                    serviceData = this.getSubscribeCOV(reader);
                    break;
                case BACnetConfirmedService.WriteProperty:
                    serviceData = this.getWriteProperty(reader);
                    break;
            }
        } catch (error) {
            throw new BACnetError(`${this.className} - getFromBuffer: Parse - ${error}`);
        }

        reqMap = {
            type: pduType,
            invokeId: invokeId,
            serviceChoice: serviceChoice,
            service: serviceData,
        };

        return reqMap;
    }

    private getSubscribeCOV (reader: BACnetReaderUtil): ILayerSimpleACKServiceSubscribeCOV {
        const serviceMap: ILayerSimpleACKServiceSubscribeCOV = {};

        return serviceMap;
    }

    private getWriteProperty (reader: BACnetReaderUtil): ILayerSimpleACKServiceWriteProperty {
        const serviceMap: ILayerSimpleACKServiceWriteProperty = {};

        return serviceMap;
    }

    /**
     * writeReq - writes the massage for simple ack (header).
     *
     * @param  {ISimpleACK} params - SimpleACK params
     * @return {BACnetWriterUtil}
     */
    public writeReq (params: IWriteSimpleACK): BACnetWriterUtil {
        const writer = new BACnetWriterUtil();

        // Write Service Type
        const mMeta = TyperUtil.setBitRange(0x00,
            BACnetServiceTypes.SimpleACKPDU, 4, 4);
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
    public writeSubscribeCOV (params: IWriteSimpleACKSubscribeCOV): BACnetWriterUtil {
        const writer = new BACnetWriterUtil();

        // Write Service choice
        writer.writeUInt8(BACnetConfirmedService.SubscribeCOV);

        return writer;
    }

    /**
     * writeWriteProperty - writes the message for WriteProperty service and
     * returns the instance of the writer utility.
     *
     * @param  {ISimpleACKWriteProperty} params - WriteProperty params
     * @return {BACnetWriterUtil}
     */
    public writeWriteProperty (params: IWriteSimpleACKWriteProperty): BACnetWriterUtil {
        const writer = new BACnetWriterUtil();

        // Write Service choice
        writer.writeUInt8(BACnetConfirmedService.WriteProperty);

        return writer;
    }
}

export const simpleACKPDU: SimpleACKPDU = new SimpleACKPDU();
