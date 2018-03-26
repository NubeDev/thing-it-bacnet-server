import {
    BACnetPropIds,
    BACnetObjTypes,
    BACnetPropTypes,
} from '../../core/enums';

import {
    IBACnetObject,
} from '../../core/interfaces';

export const NativeMetadata: IBACnetObject = {
    deviceInstance: null,
    type: null,
    instance: null,
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
