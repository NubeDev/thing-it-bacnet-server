// import {
//     BACnetPropertyId,
//     BACnetObjectType,
//     BACnetPropTypes,
//     BACnetBinaryPV,
//     BACnetPolarity,
//     BACnetEventState,
//     BACnetReliability,
//     BACnetEngineeringUnits,
// } from '../../../core/enums';

import {
    UnitPropertyObject,
} from '../../../core/interfaces';

// import * as BACnetTypes from '../../../core/bacnet/types';
import * as BACNet from 'tid-bacnet-logic';

export const AnalogMetadata: UnitPropertyObject[] = [
    {
        id: BACNet.Enums.PropertyId.units,
        payload: new BACNet.Types.BACnetEnumerated(BACNet.Enums.EngineeringUnits.noUnits),
    },
    {
        id: BACNet.Enums.PropertyId.covIncrement,
        payload: new BACNet.Types.BACnetReal(1.0),
    },
    {
        id: BACNet.Enums.PropertyId.minPresValue,
        payload: new BACNet.Types.BACnetReal(0),
    },
    {
        id: BACNet.Enums.PropertyId.maxPresValue,
        payload: new BACNet.Types.BACnetReal(100),
    }
];
