import {
    BACnetPropIds,
    BACnetObjectType,
    BACnetPropTypes,
    BACnetBinaryPV,
    BACnetPolarity,
    BACnetEventState,
    BACnetReliability,
} from '../../../../core/enums';

import {
    IBACnetObjectProperty,
} from '../../../../core/interfaces';

import * as BACnetTypes from '../../../../core/types';

export const BinaryOutputMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropIds.objectType,
        payload: new BACnetTypes.BACnetEnumerated(BACnetObjectType.BinaryOutput),
    },

    {
        id: BACnetPropIds.polarity,
        payload: new BACnetTypes.BACnetEnumerated(BACnetPolarity.Normal),
    },
    {
        id: BACnetPropIds.presentValue,
        payload: new BACnetTypes.BACnetEnumerated(BACnetBinaryPV.Active),
    },
    {
        id: BACnetPropIds.relinquishDefault,
        payload: new BACnetTypes.BACnetEnumerated(BACnetBinaryPV.Active),
    },
];
