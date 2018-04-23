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

export const BinaryValueMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropertyId.objectType,
        payload: new BACnetTypes.BACnetEnumerated(BACnetObjectType.BinaryValue),
    },

    {
        id: BACnetPropertyId.presentValue,
        payload: new BACnetTypes.BACnetEnumerated(BACnetBinaryPV.Active),
    },
    {
        id: BACnetPropertyId.relinquishDefault,
        payload: new BACnetTypes.BACnetEnumerated(BACnetBinaryPV.Active),
    },
];
