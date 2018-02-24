import {
    BACnetServiceTypes,
} from '../core/enums';

import { RequestSocket, ResponseSocket } from '../core/sockets';

export class UnconfirmReqService {
    public whoIs (req: RequestSocket, resp: ResponseSocket) {
        return;
    }
}

export const unconfirmReqService: UnconfirmReqService = new UnconfirmReqService();
