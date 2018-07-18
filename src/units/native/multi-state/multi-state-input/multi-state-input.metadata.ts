import {
    UnitStorageProperty,
} from '../../../../core/interfaces';

import * as BACNet from 'tid-bacnet-logic';

export const MultiStateInputMetadata: UnitStorageProperty[] = [
    {
        id: BACNet.Enums.PropertyId.objectType,
        payload: new BACNet.Types.BACnetEnumerated(BACNet.Enums.ObjectType.MultiStateInput),
    },
];
