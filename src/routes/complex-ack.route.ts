import { logger } from '../core/utils';

import {
    IComplexACKLayer,
} from '../core/interfaces';

import {
    BACnetConfirmedService,
    BACnetPropIds,
} from '../core/enums';

import { InputSocket, OutputSocket, ServiceSocket } from '../core/sockets';

export function ComplexACKRouter (
        inputSoc: InputSocket, outputSoc: OutputSocket, serviceSocket: ServiceSocket) {
    const apduMessage = inputSoc.apdu as IComplexACKLayer;
    const serviceChoice = apduMessage.serviceChoice;

    logger.debug(`MainRouter - Request Service: ${BACnetConfirmedService[serviceChoice]}`);
    switch (serviceChoice) {
    }
    return;
}
