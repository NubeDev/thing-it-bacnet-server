import {
    BACnetServiceTypes,
} from '../core/enums';

import { IRequestOptions } from '../core/interfaces';

export class ConfirmReqService {
    public readProperty (req: IRequestOptions) {
        return;
    }

    public writeProperty (req: IRequestOptions) {
        return;
    }

    public subscribeCOV (req: IRequestOptions) {
        return;
    }
}

export const confirmReqService: ConfirmReqService = new ConfirmReqService();
