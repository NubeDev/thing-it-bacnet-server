import * as _ from 'lodash';

import { OffsetUtil, TyperUtil, BACnetReaderUtil } from '../../utils';

import { BACNET_CONFIRMED_SERVICE } from '../../enums/service.enum';

export class SimpleACKPDU {
    constructor () {
    }

    private getFromBuffer (buf: Buffer): Map<string, any> {
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
}
