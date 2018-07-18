import {
    UnitStorageProperty,
} from '../../../../core/interfaces';

import * as BACNet from 'tid-bacnet-logic';

export const BinaryValueMetadata: UnitStorageProperty[] = [
    {
        id: BACNet.Enums.PropertyId.objectType,
        payload: new BACNet.Types.BACnetEnumerated(BACNet.Enums.ObjectType.BinaryValue),
    },

    {
        id: BACNet.Enums.PropertyId.presentValue,
        payload: new BACNet.Types.BACnetEnumerated(BACNet.Enums.BinaryPV.Active),
    },
    {
        id: BACNet.Enums.PropertyId.relinquishDefault,
        payload: new BACNet.Types.BACnetEnumerated(BACNet.Enums.BinaryPV.Active),
    },
];
