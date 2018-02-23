
import {
    BACnetPropIds,
    BACnetObjTypes,
    BACnetPropTypes,
} from './core/enums';

import {
    IBACnetModule,
    IBACnetObject,
    IBACnetObjectProperty
} from './core/interfaces';

export const BACnetModule: IBACnetModule = {
    objects: [
        {
            objType: BACnetObjTypes.Device,
            props: [
                {
                    propId: BACnetPropIds.objectName,
                    propType: BACnetPropTypes.characterString,
                    propValue: {
                        value: 'KNX-BACnet LOYTEC',
                    },
                },
                {
                    propId: BACnetPropIds.description,
                    propType: BACnetPropTypes.characterString,
                    propValue: {
                        value: 'KNX-BACnet LOYTEC',
                    },
                },
                {
                    propId: BACnetPropIds.vendorName,
                    propType: BACnetPropTypes.characterString,
                    propValue: {
                        value: 'LOYTEC electronics GmbH',
                    },
                },
                {
                    propId: BACnetPropIds.modelName,
                    propType: BACnetPropTypes.characterString,
                    propValue: {
                        value: 'LINX-202',
                    },
                },
                {
                    propId: BACnetPropIds.applicationSoftwareVersion,
                    propType: BACnetPropTypes.characterString,
                    propValue: {
                        value: 'V6',
                    },
                },
            ],
            objects: [
                {
                    objType: BACnetObjTypes.BinaryValue,
                    props: [
                        {
                            propId: BACnetPropIds.presentValue,
                            propType: BACnetPropTypes.enumerated,
                            propValue: {
                                value: 0,
                            },
                        },
                        {
                            propId: BACnetPropIds.statusFlags,
                            propType: BACnetPropTypes.bitString,
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
