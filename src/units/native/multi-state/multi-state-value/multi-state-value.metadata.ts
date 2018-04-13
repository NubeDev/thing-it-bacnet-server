import {
    BACnetPropIds,
    BACnetObjTypes,
    BACnetPropTypes,
} from '../../../../core/enums';

import {
    IBACnetObjectProperty,
} from '../../../../core/interfaces';

import * as BACnetTypes from '../../../../core/utils/types';

export const MultiStateValueMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropIds.objectType,
        payload: new BACnetTypes.BACnetEnumerated(BACnetObjTypes.MultiStateValue),
    },
];
