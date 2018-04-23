import {
    BACnetPropertyId,
    BACnetObjectType,
    BACnetBinaryPV,
    BACnetPolarity,
} from '../../../../core/bacnet/enums';

import {
    IBACnetObjectProperty,
} from '../../../../core/bacnet/interfaces';

import * as BACnetTypes from '../../../../core/bacnet/types';

export const BinaryInputMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropertyId.objectType,
        payload: new BACnetTypes.BACnetEnumerated(BACnetObjectType.BinaryInput),
    },

    {
        id: BACnetPropertyId.presentValue,
        payload: new BACnetTypes.BACnetEnumerated(BACnetBinaryPV.Active),
    },
    {
        id: BACnetPropertyId.polarity,
        payload: new BACnetTypes.BACnetEnumerated(BACnetPolarity.Normal),
    },
];
