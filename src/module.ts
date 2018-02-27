
import {
    BACnetPropIds,
    BACnetObjTypes,
    BACnetPropTypes,
} from './core/enums';

import {
    IBACnetModule,
} from './core/interfaces';

export const BACnetModule: IBACnetModule = {
    port: 1234,
    device: {
        id: 9999,
        type: BACnetObjTypes.Device,
        vendorId: 123,
        props: [
            {
                id: BACnetPropIds.objectName,
                type: BACnetPropTypes.characterString,
                values: {
                    value: '[thing-it] Test Device Name',
                },
            },
            {
                id: BACnetPropIds.description,
                type: BACnetPropTypes.characterString,
                values: {
                    value: '[thing-it] Test Device Description',
                },
            },
            {
                id: BACnetPropIds.vendorName,
                type: BACnetPropTypes.characterString,
                values: {
                    value: 'THING TECHNOLOGIES GmbH Test',
                },
            },
            {
                id: BACnetPropIds.modelName,
                type: BACnetPropTypes.characterString,
                values: {
                    value: '[thing-it] BACnet Test Server',
                },
            },
            {
                id: BACnetPropIds.applicationSoftwareVersion,
                type: BACnetPropTypes.characterString,
                values: {
                    value: 'V1.0.0',
                },
            },
        ],
        objects: [
            {
                id: 28,
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
