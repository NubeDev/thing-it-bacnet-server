import {
    UnitPropertyObject,
} from '../../../../core/interfaces';

import * as BACNet from 'tid-bacnet-logic';

export const BinaryInputMetadata: UnitPropertyObject[] = [
    {
        id: BACNet.Enums.PropertyId.objectType,
        payload: new BACNet.Types.BACnetEnumerated(BACNet.Enums.ObjectType.BinaryInput),
    },

    {
        id: BACNet.Enums.PropertyId.presentValue,
        payload: new BACNet.Types.BACnetEnumerated(BACNet.Enums.BinaryPV.Active),
    },
    {
        id: BACNet.Enums.PropertyId.polarity,
        payload: new BACNet.Types.BACnetEnumerated(BACNet.Enums.Polarity.Normal),
    },
];
