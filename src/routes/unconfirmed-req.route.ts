import { logger } from '../core/utils';

import {
    ILayerUnconfirmedReq,
} from '../core/bacnet/interfaces';

import {
    BACnetUnconfirmedService,
} from '../core/bacnet/enums';

import { unitUnconfirmedReqService } from '../services';

import { InputSocket, OutputSocket, ServiceSocket } from '../core/sockets';

export function UnconfirmedReqRouter (
        inputSoc: InputSocket, outputSoc: OutputSocket, serviceSocket: ServiceSocket) {
    const apduMessage = inputSoc.apdu as ILayerUnconfirmedReq;
    const serviceChoice = apduMessage.serviceChoice;

    logger.debug(`MainRouter - Request Service: ${BACnetUnconfirmedService[serviceChoice]}`);
    switch (serviceChoice) {
        case BACnetUnconfirmedService.whoIs:
            return unitUnconfirmedReqService.whoIs(inputSoc, outputSoc, serviceSocket);
    }
    return;
}
