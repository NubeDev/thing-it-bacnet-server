import {
    BACnetPropIds,
    BACnetObjTypes,
    BACnetPropTypes,
} from '../../../core/enums';

import {
    IBACnetObjectProperty,
} from '../../../core/interfaces';

export const AnalogOutputMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropIds.objectType,
        type: BACnetPropTypes.enumerated,
        payload: {
            value: BACnetObjTypes.AnalogOutput,
        },
    },
];
