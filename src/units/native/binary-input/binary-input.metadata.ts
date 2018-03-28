import {
    BACnetPropIds,
    BACnetObjTypes,
    BACnetPropTypes,
    BACnetBinaryPV,
    BACnetPolarity,
} from '../../../core/enums';

import {
    IBACnetObjectProperty,
} from '../../../core/interfaces';

export const BinaryInputMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropIds.outOfService,
        type: BACnetPropTypes.boolean,
        payload: {
            value: false,
        },
    },
    {
        id: BACnetPropIds.presentValue,
        type: BACnetPropTypes.enumerated,
        payload: {
            value: BACnetBinaryPV.Active,
        },
    },
    {
        id: BACnetPropIds.polarity,
        type: BACnetPropTypes.enumerated,
        payload: {
            value: BACnetPolarity.Normal,
        },
    },
];
