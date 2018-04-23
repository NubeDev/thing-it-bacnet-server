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

export const BinaryValueMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropIds.objectType,
        payload: new BACnetTypes.BACnetEnumerated(BACnetObjectType.BinaryValue),
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
