import { logger } from '../core/utils';

import {
    ILayerConfirmedReq,
} from '../core/bacnet/interfaces';

import {
    BACnetConfirmedService,
} from '../core/bacnet/enums';

import { unitConfirmedReqService } from '../services';

import { InputSocket, OutputSocket, ServiceSocket } from '../core/sockets';

export function ConfirmedReqRouter (
        inputSoc: InputSocket, outputSoc: OutputSocket, serviceSocket: ServiceSocket) {
        const apduMessage = inputSoc.apdu as ILayerConfirmedReq;
        const serviceChoice = apduMessage.serviceChoice;

    logger.debug(`MainRouter - Request Service: ${BACnetConfirmedService[serviceChoice]}`);
    switch (serviceChoice) {
        case BACnetConfirmedService.ReadProperty:
            return unitConfirmedReqService.readProperty(inputSoc, outputSoc, serviceSocket);
        case BACnetConfirmedService.WriteProperty:
            return unitConfirmedReqService.writeProperty(inputSoc, outputSoc, serviceSocket);
        case BACnetConfirmedService.SubscribeCOV:
            return unitConfirmedReqService.subscribeCOV(inputSoc, outputSoc, serviceSocket);
    }
    return;
}
