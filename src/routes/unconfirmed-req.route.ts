import { logger } from '../core/utils';

// import {
//     ILayerUnconfirmedReq,
// } from '../core/interfaces';

// import {
//     BACnetUnconfirmedService,
// } from '../core/bacnet/enums';

import { unitUnconfirmedReqService } from '../services';

import { InputSocket, OutputSocket, ServiceSocket } from '../core/sockets';

import * as BACNet from 'tid-bacnet-logic';

export function UnconfirmedReqRouter (
        inputSoc: InputSocket, outputSoc: OutputSocket, serviceSocket: ServiceSocket) {
    const apduMessage = inputSoc.apdu as BACNet.Interfaces.UnconfirmedRequest.Read.Layer;
    const serviceChoice = apduMessage.serviceChoice;

    logger.debug(`MainRouter - Request Service: ${BACNet.Enums.UnconfirmedServiceChoice[serviceChoice]}`);
    switch (serviceChoice) {
        case BACNet.Enums.UnconfirmedServiceChoice.whoIs:
            return unitUnconfirmedReqService.whoIs(inputSoc, outputSoc, serviceSocket);
    }
    return;
}
