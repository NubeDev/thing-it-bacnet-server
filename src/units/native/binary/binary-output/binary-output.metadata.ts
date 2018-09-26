import {
    UnitStorageProperty,
} from '../../../../core/interfaces';

import * as BACNet from 'tid-bacnet-logic';

export const BinaryOutputMetadata: UnitStorageProperty[] = [
    {
        id: BACNet.Enums.PropertyId.objectType,
        payload: new BACNet.Types.BACnetEnumerated(BACNet.Enums.ObjectType.BinaryOutput),
    },

    {
        id: BACNet.Enums.PropertyId.polarity,
        payload: new BACNet.Types.BACnetEnumerated(BACNet.Enums.Polarity.Normal),
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
