import * as _ from 'lodash';

import { OffsetUtil, TyperUtil, BACnetReaderUtil } from '../utils';

import { ConfirmReqPDU, SimpleACKPDU, UnconfirmReqPDU, ComplexACKPDU } from './apdus';

import { BACnetServiceTypes } from '../enums';

export class APDU {
    constructor () {
    }

    public getFromBuffer (buf: Buffer): Map<string, any> {
        const reader = new BACnetReaderUtil(buf);

        const mType = reader.readUInt8();
        const pduType = (mType >> 4) & 0x0F

        let reqInst;
        switch (pduType) {
            case BACnetServiceTypes.ConfirmedReqPDU: {
                reqInst = new ConfirmReqPDU();
                break;
            }
            case BACnetServiceTypes.UnconfirmedReqPDU: {
                reqInst = new UnconfirmReqPDU();
                break;
            }
            case BACnetServiceTypes.SimpleACKPDU: {
                reqInst = new SimpleACKPDU();
                break;
            }
            case BACnetServiceTypes.ComplexACKPDU: {
                reqInst = new ComplexACKPDU();
                break;
            }
        }
        const APDUMessage = reqInst.getFromBuffer(buf);

        return APDUMessage;
    }
}

export const apdu: APDU = new APDU();
