import {
    BACnetServiceTypes,
} from '../core/enums';

import { ConfirmReqRouter } from './confirm-req.route';
import { UnconfirmReqRouter } from './unconfirm-req.route';

import { RequestSocket, ResponseSocket } from '../core/sockets';

export function MainRouter (req: RequestSocket, resp: ResponseSocket) {
    const apduReq = req.apdu;

    switch (apduReq.get('type')) {
        case BACnetServiceTypes.ConfirmedReqPDU:
            return ConfirmReqRouter(req, resp);
        case BACnetServiceTypes.UnconfirmedReqPDU:
            return UnconfirmReqRouter(req, resp);
    }
    return;
}
