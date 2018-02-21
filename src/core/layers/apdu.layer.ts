import * as _ from 'lodash';

import { OffsetUtil, TyperUtil, BACnetReaderUtil } from '../utils';

import { ConfirmReqPDU, SimpleACKPDU, UnconfirmReqPDU } from './apdus';

import { BACNET_SERVICE_TYPES } from '../enums';

export class APDU {
    constructor () {
    }

    public getFromBuffer (buf: Buffer): Map<string, any> {
        const reader = new BACnetReaderUtil(buf);

        const mType = reader.readUInt8();
        const pduType = (mType >> 4) & 0x0F

        let reqInst;
        switch (mType) {
            case BACNET_SERVICE_TYPES.ConfirmedReqPDU: {
                reqInst = new ConfirmReqPDU();
                break;
            }
            case BACNET_SERVICE_TYPES.UnconfirmedReqPDU: {
                reqInst = new UnconfirmReqPDU();
                break;
            }
            case BACNET_SERVICE_TYPES.ConfirmedReqPDU: {
                reqInst = new ConfirmReqPDU();
                break;
            }
        }
        const APDUMessage = reqInst.getFromBuffer(buf);

        return APDUMessage;
    }
}
