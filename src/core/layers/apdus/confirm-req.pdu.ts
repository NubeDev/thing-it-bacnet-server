import * as _ from 'lodash';

import { OffsetUtil, TyperUtil, BACnetReaderUtil } from '../../utils';

import { BACNET_CONFIRMED_SERVICE } from '../../enums/service.enum';

export class ConfirmReqPDU {
    constructor () {
    }

    public getFromBuffer (buf: Buffer): Map<string, any> {
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

        const pduSa = TyperUtil.getBit(mMeta, 1);
        reqMap.set('sa', pduSa);

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
            case BACNET_CONFIRMED_SERVICE.SubscribeCOV:
                serviceMap = this.getSubscribeCOV(reader);
                break;
            case BACNET_CONFIRMED_SERVICE.ReadProperty:
                serviceMap = this.getReadProperty(reader);
                break;
            case BACNET_CONFIRMED_SERVICE.WriteProperty:
                serviceMap = this.getWriteProperty(reader);
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

        return serviceMap;
    }

    private getSubscribeCOV (reader: BACnetReaderUtil): Map<string, any> {
        const serviceMap: Map<string, any> = new Map();

        const subscriberProcessId = reader.readParam();
        serviceMap.set('subscriberProcessId', subscriberProcessId);

        const objIdent = reader.readObjectIdentifier();
        serviceMap.set('objIdent', objIdent);

        const issConfNotif = reader.readParam();
        serviceMap.set('issConfNotif', issConfNotif);

        const lifeTime = reader.readParam();
        serviceMap.set('lifeTime', lifeTime);

        return serviceMap;
    }

    private getWriteProperty (reader: BACnetReaderUtil): Map<string, any> {
        const serviceMap: Map<string, any> = new Map();

        const objIdent = reader.readObjectIdentifier();
        serviceMap.set('objIdent', objIdent);

        const propIdent = reader.readProperty();
        serviceMap.set('propIdent', propIdent);

        const propValue = reader.readParamValue();
        serviceMap.set('propValue', propValue);

        const priority = reader.readParam();
        serviceMap.set('priority', priority);

        return serviceMap;
    }
}
