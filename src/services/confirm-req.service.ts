import {
    BACnetServiceTypes,
} from '../core/enums';

import { RequestSocket, ResponseSocket } from '../core/sockets';

export class ConfirmReqService {
    public readProperty (req: RequestSocket, resp: ResponseSocket) {
        return;
    }

    public writeProperty (req: RequestSocket, resp: ResponseSocket) {
        return;
    }

    public subscribeCOV (req: RequestSocket, resp: ResponseSocket) {
        return;
    }
}

export const confirmReqService: ConfirmReqService = new ConfirmReqService();
