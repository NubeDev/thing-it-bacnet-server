import {
    BACnetConfirmedService,
} from '../core/enums';

import { IRequestOptions } from '../core/interfaces';

import { confirmReqService } from '../services/confirm-req.service';

export function ConfirmReqRouter (req: IRequestOptions) {
    const apduMessage = req.apdu;

    switch (apduMessage.get('serviceChoice')) {
        case BACnetConfirmedService.ReadProperty:
            return confirmReqService.readProperty(req);
        case BACnetConfirmedService.WriteProperty:
            return confirmReqService.writeProperty(req);
        case BACnetConfirmedService.SubscribeCOV:
            return confirmReqService.subscribeCOV(req);
    }
    return;
}
