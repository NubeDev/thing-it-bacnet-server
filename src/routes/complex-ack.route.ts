import { logger } from '../core/utils';

// import {
//     ILayerComplexACK,
// } from '../core/interfaces';

// import {
//     BACnetConfirmedService,
//     BACnetPropertyId,
// } from '../core/bacnet/enums';

import * as BACNet from 'tid-bacnet-logic';

import { InputSocket, OutputSocket, ServiceSocket } from '../core/sockets';

export function ComplexACKRouter (
        inputSoc: InputSocket, outputSoc: OutputSocket, serviceSocket: ServiceSocket) {
    const apduMessage = inputSoc.apdu as BACNet.Interfaces.ComplexACK.Read.Layer;
    const serviceChoice = apduMessage.serviceChoice;

    logger.debug(`MainRouter - Request Service: ${BACNet.Enums.ConfirmedServiceChoice[serviceChoice]}`);
    switch (serviceChoice) {
    }
    return;
}
