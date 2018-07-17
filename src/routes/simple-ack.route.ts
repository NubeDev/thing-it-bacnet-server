import { logger } from '../core/utils';

// import {
//     ILayerSimpleACK,
// } from '../core/interfaces';

// import {
//     BACnetConfirmedService,
// } from '../core/bacnet/enums';

import { InputSocket, OutputSocket, ServiceSocket } from '../core/sockets';

import * as BACNet from 'tid-bacnet-logic';

export function SimpleACKRouter (
        inputSoc: InputSocket, outputSoc: OutputSocket, serviceSocket: ServiceSocket) {
    const apduMessage = inputSoc.apdu as BACNet.Interfaces.SimpleACK.Read.Layer;
    const serviceChoice = apduMessage.serviceChoice;

    logger.debug(`MainRouter - Request Service: ${BACNet.Enums.ConfirmedServiceChoice[serviceChoice]}`);
    switch (serviceChoice) {
    }
    return;
}
