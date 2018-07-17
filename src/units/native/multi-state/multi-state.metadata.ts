
import {
    UnitPropertyObject,
} from '../../../core/interfaces';

// import * as BACnetTypes from '../../../core/bacnet/types';
import * as BACNet from 'tid-bacnet-logic';

export const MultiStateMetadata: UnitPropertyObject[] = [
    {
        id: BACNet.Enums.PropertyId.presentValue,
        payload: new BACNet.Types.BACnetUnsignedInteger(1),
    },
    {
        id: BACNet.Enums.PropertyId.numberOfStates,
        payload: new BACNet.Types.BACnetUnsignedInteger(1),
    },
];
