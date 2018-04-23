import {
    BACnetPropertyId,
    BACnetObjectType,
    BACnetPropTypes,
} from '../../core/bacnet/enums';

import {
    IBACnetObjectProperty,
} from '../../core/bacnet/interfaces';

import * as BACnetTypes from '../../core/bacnet/types';

export const NativeMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropertyId.objectIdentifier,
        payload: new BACnetTypes.BACnetObjectId(),
    },
    {
        id: BACnetPropertyId.objectName,
        payload: new BACnetTypes.BACnetCharacterString('[thing-it] Test Device Name'),
    },
    {
        id: BACnetPropertyId.objectType,
        payload: new BACnetTypes.BACnetEnumerated(),
    },
    {
        id: BACnetPropertyId.description,
        payload: new BACnetTypes.BACnetCharacterString('[thing-it] Test Device Description'),
    },
];
