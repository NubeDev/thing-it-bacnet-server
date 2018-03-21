import { logger } from '../core/utils';

import {
    IConfirmedReqLayer,
} from '../core/interfaces';

import {
    BACnetConfirmedService,
} from '../core/enums';

import { confirmReqService, simpleACKService, complexACKService } from '../services';

import { InputSocket, OutputSocket, ServiceSocket } from '../core/sockets';

export function ConfirmedReqRouter (
        inputSoc: InputSocket, outputSoc: OutputSocket, serviceSocket: ServiceSocket) {
        const apduMessage = inputSoc.apdu as IConfirmedReqLayer;
        const serviceChoice = apduMessage.serviceChoice;

    logger.debug(`MainRouter - Request Service: ${BACnetConfirmedService[serviceChoice]}`);
    switch (serviceChoice) {
        case BACnetConfirmedService.ReadProperty:
            return complexACKService.readProperty(inputSoc, outputSoc, serviceSocket);
        case BACnetConfirmedService.WriteProperty:
            return simpleACKService.writeProperty(inputSoc, outputSoc, serviceSocket);
        case BACnetConfirmedService.SubscribeCOV:
            return simpleACKService.subscribeCOV(inputSoc, outputSoc, serviceSocket);
    }
    return;
}
