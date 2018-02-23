
import {
    BACnetPropIds,
    BACnetObjTypes,
    BACnetPropTypes,
} from './core/enums';

import {
    IBACnetModule,
} from './core/interfaces';

export const BACnetModule: IBACnetModule = {
    device: {
        id: 9999,
        type: BACnetObjTypes.Device,
        vendorId: 123,
        props: [
            {
                id: BACnetPropIds.objectName,
                type: BACnetPropTypes.characterString,
                values: {
                    value: 'KNX-BACnet LOYTEC',
                },
            },
            {
                id: BACnetPropIds.description,
                type: BACnetPropTypes.characterString,
                values: {
                    value: 'KNX-BACnet LOYTEC',
                },
            },
            {
                id: BACnetPropIds.vendorName,
                type: BACnetPropTypes.characterString,
                values: {
                    value: 'LOYTEC electronics GmbH',
                },
            },
            {
                id: BACnetPropIds.modelName,
                type: BACnetPropTypes.characterString,
                values: {
                    value: 'LINX-202',
                },
            },
            {
                id: BACnetPropIds.applicationSoftwareVersion,
                type: BACnetPropTypes.characterString,
                values: {
                    value: 'V6',
                },
            },
        ],
        objects: [
            {
                type: BACnetObjTypes.BinaryValue,
                props: [
                    {
                        id: BACnetPropIds.presentValue,
                        type: BACnetPropTypes.enumerated,
                        values: {
                            value: 0,
                        },
                    },
                    {
                        id: BACnetPropIds.statusFlags,
                        type: BACnetPropTypes.bitString,
                        values: {
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
}
