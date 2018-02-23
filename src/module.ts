
import {
    BACNET_PROPERTY_KEYS,
    BACNET_OBJECT_TYPES,
    BACNET_PROP_TYPES,
} from './core/enums';

import {
    IBACnetModule,
    IBACnetObject,
    IBACnetObjectProperty
} from './core/interfaces';

export const BACnetModule: IBACnetModule = {
    objects: [
        {
            objType: BACNET_OBJECT_TYPES.Device,
            props: [
                {
                    propId: BACNET_PROPERTY_KEYS.objectName,
                    propType: BACNET_PROP_TYPES.characterString,
                    propValue: {
                        value: 'KNX-BACnet LOYTEC',
                    },
                },
                {
                    propId: BACNET_PROPERTY_KEYS.description,
                    propType: BACNET_PROP_TYPES.characterString,
                    propValue: {
                        value: 'KNX-BACnet LOYTEC',
                    },
                },
                {
                    propId: BACNET_PROPERTY_KEYS.vendorName,
                    propType: BACNET_PROP_TYPES.characterString,
                    propValue: {
                        value: 'LOYTEC electronics GmbH',
                    },
                },
                {
                    propId: BACNET_PROPERTY_KEYS.modelName,
                    propType: BACNET_PROP_TYPES.characterString,
                    propValue: {
                        value: 'LINX-202',
                    },
                },
                {
                    propId: BACNET_PROPERTY_KEYS.applicationSoftwareVersion,
                    propType: BACNET_PROP_TYPES.characterString,
                    propValue: {
                        value: 'V6',
                    },
                },
            ],
            objects: [
                {
                    objType: BACNET_OBJECT_TYPES.BinaryValue,
                    props: [
                        {
                            propId: BACNET_PROPERTY_KEYS.presentValue,
                            propType: BACNET_PROP_TYPES.enumerated,
                            propValue: {
                                value: 0,
                            },
                        },
                        {
                            propId: BACNET_PROPERTY_KEYS.statusFlags,
                            propType: BACNET_PROP_TYPES.bitString,
                            propValue: {
                                inAlarm: false,
                                fault: false,
                                overridden: false,
                                outOfService: false,
                            },
                        },
                    ],
                },
            ],
        },
    ]
}
