import {
    BACnetServiceTypes,
} from '../core/enums';

import { IRequestOptions } from '../core/interfaces';

import { ConfirmReqRouter } from './confirm-req.route';
import { UnconfirmReqRouter } from './unconfirm-req.route';

export function MainRouter (req: IRequestOptions) {
    const apduReq = req.apdu;

    switch (apduReq.get('type')) {
        case BACnetServiceTypes.ConfirmedReqPDU:
            return ConfirmReqRouter(req);
        case BACnetServiceTypes.UnconfirmedReqPDU:
            return UnconfirmReqRouter(req);
    }
    return;
}
