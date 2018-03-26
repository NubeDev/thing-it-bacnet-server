import {
    BACnetPropIds,
    BACnetObjTypes,
    BACnetPropTypes,
} from '../../../core/enums';

import {
    IBACnetObjectProperty,
} from '../../../core/interfaces';

export const DeviceMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropIds.vendorIdentifier,
        type: BACnetPropTypes.characterString,
        payload: {
            value: '[thing-it] Test Device Name',
        },
    },
    {
        id: BACnetPropIds.vendorName,
        type: BACnetPropTypes.characterString,
        payload: {
            value: 'THING TECHNOLOGIES GmbH Test',
        },
    },
    {
        id: BACnetPropIds.modelName,
        type: BACnetPropTypes.characterString,
        payload: {
            value: '[thing-it] BACnet Test Server',
        },
    },
    {
        id: BACnetPropIds.applicationSoftwareVersion,
        type: BACnetPropTypes.characterString,
        payload: {
            value: 'V1.0.0',
        },
    },
];
