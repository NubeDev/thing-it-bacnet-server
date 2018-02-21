import * as _ from 'lodash';

import { OffsetUtil, TyperUtil, BACnetReaderUtil } from '../../utils';

export class UnconfirmReqPDU {
    constructor () {
    }

    private getFromBuffer (buf: Buffer): Map<string, any> {
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
            case 0x00:
                serviceMap = this.getIAm(reader);
                break;
            case 0x08:
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
}
