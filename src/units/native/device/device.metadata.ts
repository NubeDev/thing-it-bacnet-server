import {
    BACnetPropIds,
    BACnetObjectType,
    BACnetPropTypes,
} from '../../../core/enums';

import {
    IBACnetObjectProperty,
} from '../../../core/interfaces';

import * as BACnetTypes from '../../../core/types';

export const DeviceMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropIds.objectType,
        payload: new BACnetTypes.BACnetEnumerated(BACnetObjectType.Device),
    },
    {
        id: BACnetPropIds.vendorIdentifier,
        payload: new BACnetTypes.BACnetCharacterString('[thing-it] Test Device Name'),
    },
    {
        id: BACnetPropIds.vendorName,
        payload: new BACnetTypes.BACnetCharacterString('THING TECHNOLOGIES GmbH Test'),
    },
    {
        id: BACnetPropIds.modelName,
        payload: new BACnetTypes.BACnetCharacterString('[thing-it] BACnet Test Server'),
    },
    {
        id: BACnetPropIds.applicationSoftwareVersion,
        payload: new BACnetTypes.BACnetCharacterString('V1.0.0'),
    },
];
