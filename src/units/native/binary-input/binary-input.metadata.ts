import {
    BACnetPropIds,
    BACnetObjTypes,
    BACnetPropTypes,
    BACnetBinaryPV,
    BACnetPolarity,
    BACnetEventState,
    BACnetReliability,
} from '../../../core/enums';

import {
    IBACnetObjectProperty,
} from '../../../core/interfaces';

import * as BACnetTypes from '../../../core/utils/types';

export const BinaryInputMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropIds.objectType,
        payload: new BACnetTypes.BACnetEnumerated(BACnetObjTypes.BinaryInput),
    },

    {
        id: BACnetPropIds.presentValue,
        payload: new BACnetTypes.BACnetEnumerated(BACnetBinaryPV.Active),
    },
    {
        id: BACnetPropIds.polarity,
        payload: new BACnetTypes.BACnetEnumerated(BACnetPolarity.Normal),
    },
];
