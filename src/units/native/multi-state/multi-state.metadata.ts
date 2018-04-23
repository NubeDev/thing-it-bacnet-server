import {
    BACnetPropertyId,
    BACnetObjectType,
} from '../../../core/bacnet/enums';

import {
    IBACnetObjectProperty,
} from '../../../core/bacnet/interfaces';

import * as BACnetTypes from '../../../core/bacnet/types';

export const MultiStateMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropertyId.presentValue,
        payload: new BACnetTypes.BACnetUnsignedInteger(1),
    },
    {
        id: BACnetPropertyId.numberOfStates,
        payload: new BACnetTypes.BACnetUnsignedInteger(1),
    },
];
