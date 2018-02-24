import {
    BACnetServiceTypes,
} from '../core/enums';

import { IRequestOptions } from '../core/interfaces';

export class UnconfirmReqService {
    public whoIs (req: IRequestOptions) {
        return;
    }
}

export const unconfirmReqService: UnconfirmReqService = new UnconfirmReqService();
