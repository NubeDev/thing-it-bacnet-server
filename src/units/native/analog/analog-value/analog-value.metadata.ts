import {
    BACnetPropertyId,
    BACnetObjectType,
    BACnetPropTypes,
    BACnetEngineeringUnits,
} from '../../../../core/bacnet/enums';

import {
    IBACnetObjectProperty,
} from '../../../../core/bacnet/interfaces';

import * as BACnetTypes from '../../../../core/bacnet/types';

export const AnalogValueMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropertyId.objectType,
        payload: new BACnetTypes.BACnetEnumerated(BACnetObjectType.AnalogValue),
    },
    {
        id: BACnetPropertyId.relinquishDefault,
        payload: new BACnetTypes.BACnetReal(0.0),
    },
];
