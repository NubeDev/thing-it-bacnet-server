import {
    BACnetPropIds,
    BACnetObjTypes,
    BACnetPropTypes,
} from '../../core/enums';

import {
    IBACnetObjectProperty,
} from '../../core/interfaces';

export const NativeMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropIds.objectIdentifier,
        type: BACnetPropTypes.objectIdentifier,
        payload: {
            type: null,
            instance: null,
        },
    },
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
];
