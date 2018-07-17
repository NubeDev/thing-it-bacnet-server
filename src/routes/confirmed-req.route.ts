import { logger } from '../core/utils';

// import {
//     ILayerConfirmedReq,
// } from '../core/interfaces';

// import {
//     BACnetConfirmedService,
// } from '../core/enums';

import { unitConfirmedReqService } from '../services';

import { InputSocket, OutputSocket, ServiceSocket } from '../core/sockets';

import * as BACNet from 'tid-bacnet-logic';

export function ConfirmedReqRouter (
        inputSoc: InputSocket, outputSoc: OutputSocket, serviceSocket: ServiceSocket) {
        const apduMessage = inputSoc.apdu as BACNet.Interfaces.ConfirmedRequest.Read.Layer;
        const serviceChoice = apduMessage.serviceChoice;

    logger.debug(`MainRouter - Request Service: ${BACNet.Enums.ConfirmedServiceChoice[serviceChoice]}`);
    switch (serviceChoice) {
        case BACNet.Enums.ConfirmedServiceChoice.ReadProperty:
            return unitConfirmedReqService.readProperty(inputSoc, outputSoc, serviceSocket);
        case BACNet.Enums.ConfirmedServiceChoice.WriteProperty:
            return unitConfirmedReqService.writeProperty(inputSoc, outputSoc, serviceSocket);
        case BACNet.Enums.ConfirmedServiceChoice.SubscribeCOV:
            return unitConfirmedReqService.subscribeCOV(inputSoc, outputSoc, serviceSocket);
    }
    return;
}
