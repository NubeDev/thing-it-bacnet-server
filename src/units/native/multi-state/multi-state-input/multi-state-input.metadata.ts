import {
    BACnetPropIds,
    BACnetObjectType,
    BACnetPropTypes,
} from '../../../../core/enums';

import {
    IBACnetObjectProperty,
} from '../../../../core/interfaces';

import * as BACnetTypes from '../../../../core/types';

export const MultiStateInputMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropIds.objectType,
        payload: new BACnetTypes.BACnetEnumerated(BACnetObjectType.MultiStateInput),
    },
];
