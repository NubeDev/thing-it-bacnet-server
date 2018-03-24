import {
    BACnetPropIds,
    BACnetObjTypes,
    BACnetPropTypes,
} from '../../../core/enums';

import {
    IBACnetObject,
} from '../../../core/interfaces';

export const DeviceMetadata: IBACnetObject = {
    type: BACnetObjTypes.Device,
    instance: 0,
    props: [
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
    ]
};
