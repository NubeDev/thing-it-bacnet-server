import {
    BACnetPropertyId,
    BACnetObjectType,
    BACnetPropTypes,
} from '../../../../core/bacnet/enums';

import {
    IBACnetObjectProperty,
} from '../../../../core/bacnet/interfaces';

import * as BACnetTypes from '../../../../core/bacnet/types';

export const MultiStateOutputMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropertyId.objectType,
        payload: new BACnetTypes.BACnetEnumerated(BACnetObjectType.MultiStateOutput),
    },
];
