import {
    UnitStorageProperty,
} from '../../../core/interfaces';

import * as BACNet from 'tid-bacnet-logic';

export const MultiStateMetadata: UnitStorageProperty[] = [
    {
        id: BACNet.Enums.PropertyId.numberOfStates,
        payload: new BACNet.Types.BACnetUnsignedInteger(2),
    },
    {
        id: BACNet.Enums.PropertyId.stateText,
        payload: [
            new BACNet.Types.BACnetCharacterString('ON'),
            new BACNet.Types.BACnetCharacterString('OFF'),
        ]
    }
];
