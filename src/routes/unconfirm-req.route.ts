import {
    BACnetUnconfirmedService,
} from '../core/enums';

import { unconfirmReqService } from '../services';

import { RequestSocket, ResponseSocket } from '../core/sockets';

export function UnconfirmReqRouter (req: RequestSocket, resp: ResponseSocket) {
    const apduMessage = req.apdu;

    switch (apduMessage.get('serviceChoice')) {
        case BACnetUnconfirmedService.whoIs:
            return unconfirmReqService.whoIs(req, resp);
    }
    return;
}
