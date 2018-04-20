import {
    BACnetPropIds,
} from '../../../../core/enums';

import {
    IBACnetObjectProperty,
} from '../../../../core/interfaces';

import * as BACnetTypes from '../../../../core/types';

export const MetainfoMiddleMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropIds.objectIdentifier,
        payload: new BACnetTypes.BACnetObjectId(),
    },
    {
        id: BACnetPropIds.objectName,
        payload: new BACnetTypes.BACnetCharacterString('[thing-it] Test Device Name'),
    },
    {
        id: BACnetPropIds.objectType,
        payload: new BACnetTypes.BACnetEnumerated(),
    },
    {
        id: BACnetPropIds.description,
        payload: new BACnetTypes.BACnetCharacterString('[thing-it] Test Device Description'),
    },
];
