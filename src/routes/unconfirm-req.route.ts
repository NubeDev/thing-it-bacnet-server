import {
    BACnetUnconfirmedService,
} from '../core/enums';

import { IRequestOptions } from '../core/interfaces';

import { unconfirmReqService } from '../services/unconfirm-req.service';

export function UnconfirmReqRouter (req: IRequestOptions) {
    const apduMessage = req.apdu;

    switch (apduMessage.get('serviceChoice')) {
        case BACnetUnconfirmedService.whoIs:
            return unconfirmReqService.whoIs(req);
    }
    return;
}
