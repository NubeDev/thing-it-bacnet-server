import {
    BACnetPropertyId,
    BACnetObjectType,
    BACnetPropTypes,
} from '../../../core/bacnet/enums';

import {
    IBACnetObjectProperty,
} from '../../../core/bacnet/interfaces';

import * as BACnetTypes from '../../../core/bacnet/types';

export const DeviceMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropertyId.objectType,
        payload: new BACnetTypes.BACnetEnumerated(BACnetObjectType.Device),
    },
    {
        id: BACnetPropertyId.vendorIdentifier,
        payload: new BACnetTypes.BACnetCharacterString('[thing-it] Test Device Name'),
    },
    {
        id: BACnetPropertyId.vendorName,
        payload: new BACnetTypes.BACnetCharacterString('THING TECHNOLOGIES GmbH Test'),
    },
    {
        id: BACnetPropertyId.modelName,
        payload: new BACnetTypes.BACnetCharacterString('[thing-it] BACnet Test Server'),
    },
    {
        id: BACnetPropertyId.applicationSoftwareVersion,
        payload: new BACnetTypes.BACnetCharacterString('V1.0.0'),
    },
];
