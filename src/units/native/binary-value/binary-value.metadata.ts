import {
    BACnetPropIds,
    BACnetObjTypes,
    BACnetPropTypes,
} from '../../../core/enums';

import {
    IBACnetObjectProperty,
} from '../../../core/interfaces';

export const BinaryValueMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropIds.objectType,
        type: BACnetPropTypes.enumerated,
        payload: {
            value: BACnetObjTypes.BinaryValue,
        },
    },
    {
        id: BACnetPropIds.presentValue,
        type: BACnetPropTypes.enumerated,
        payload: {
            value: 0,
        },
    },
    {
        id: BACnetPropIds.statusFlags,
        type: BACnetPropTypes.bitString,
        payload: {
            inAlarm: false,
            fault: false,
            overridden: false,
            outOfService: false,
        },
    },
];
