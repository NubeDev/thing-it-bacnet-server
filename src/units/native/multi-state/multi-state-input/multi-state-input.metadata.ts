import {
    UnitStorageProperty,
} from '../../../../core/interfaces';

import * as BACNet from 'tid-bacnet-logic';

export const MultiStateInputMetadata: UnitStorageProperty[] = [
    {
        id: BACNet.Enums.PropertyId.presentValue,
        payload: new BACNet.Types.BACnetUnsignedInteger(1),
    },
    {
        id: BACNet.Enums.PropertyId.objectType,
        payload: new BACNet.Types.BACnetEnumerated(BACNet.Enums.ObjectType.MultiStateInput),
    },
];
