import {
    BACnetPropIds,
    BACnetObjTypes,
    BACnetPropTypes,
} from '../../../core/enums';

import {
    IBACnetObjectProperty,
} from '../../../core/interfaces';

export const AnalogValueMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropIds.objectType,
        type: BACnetPropTypes.enumerated,
        payload: {
            value: BACnetObjTypes.AnalogValue,
        },
    },
];
