import {
    BACnetConfirmedService,
} from '../core/enums';

import { confirmReqService, simpleACKService } from '../services';

import { RequestSocket, ResponseSocket } from '../core/sockets';

export function ConfirmReqRouter (req: RequestSocket, resp: ResponseSocket) {
    const apduMessage = req.apdu;

    switch (apduMessage.get('serviceChoice')) {
        case BACnetConfirmedService.ReadProperty:
            return confirmReqService.readProperty(req, resp);
        case BACnetConfirmedService.WriteProperty:
            return confirmReqService.writeProperty(req, resp);
        case BACnetConfirmedService.SubscribeCOV:
            return simpleACKService.subscribeCOV(req, resp);
    }
    return;
}
