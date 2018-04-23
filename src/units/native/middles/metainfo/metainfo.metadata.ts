import {
    BACnetPropertyId,
} from '../../../../core/enums';

import {
    IBACnetObjectProperty,
} from '../../../../core/interfaces';

import * as BACnetTypes from '../../../../core/types';

export const MetainfoMiddleMetadata: IBACnetObjectProperty[] = [
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
