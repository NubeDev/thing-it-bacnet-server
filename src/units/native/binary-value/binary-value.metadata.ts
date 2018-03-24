import {
    BACnetPropIds,
    BACnetObjTypes,
    BACnetPropTypes,
} from '../../../core/enums';

import {
    IBACnetObject,
} from '../../../core/interfaces';

export const BinaryValueMetadata: IBACnetObject = {
    type: BACnetObjTypes.BinaryValue,
    instance: 0,
    props: [
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
    ]
};
