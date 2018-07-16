import {
    BACnetPropertyId,
    BACnetObjectType,
    BACnetPropTypes,
    BACnetBinaryPV,
    BACnetPolarity,
    BACnetEventState,
    BACnetReliability,
    BACnetEngineeringUnits,
} from '../../../core/bacnet/enums';

import {
    IBACnetObjectProperty,
} from '../../../core/bacnet/interfaces';

import * as BACnetTypes from '../../../core/bacnet/types';

export const AnalogMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropertyId.units,
        payload: new BACnetTypes.BACnetEnumerated(BACnetEngineeringUnits.noUnits),
    },
    {
        id: BACnetPropertyId.covIncrement,
        payload: new BACnetTypes.BACnetReal(1.0),
    },
    {
        id: BACnetPropertyId.minPresValue,
        payload: new BACnetTypes.BACnetReal(0),
    },
    {
        id: BACnetPropertyId.maxPresValue,
        payload: new BACnetTypes.BACnetReal(100),
    }
];
