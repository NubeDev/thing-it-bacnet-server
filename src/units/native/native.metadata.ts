import {
    BACnetPropIds,
    BACnetObjTypes,
    BACnetPropTypes,
} from '../../core/enums';

import {
    IBACnetObject,
} from '../../core/interfaces';

export const NativeMetadata: IBACnetObject = {
    deviceInstance: 0,
    type: 0,
    instance: 0,
    props: [
        {
            id: BACnetPropIds.objectName,
            type: BACnetPropTypes.characterString,
            payload: {
                value: '[thing-it] Test Device Name',
            },
        },
        {
            id: BACnetPropIds.description,
            type: BACnetPropTypes.characterString,
            payload: {
                value: '[thing-it] Test Device Description',
            },
        },
    ]
};
