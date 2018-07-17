// import {
//     BACnetPropertyId,
//     BACnetObjectType,
//     BACnetPropTypes,
//     BACnetEngineeringUnits,
// } from '../../../../core/enums';

import {
    UnitPropertyObject,
} from '../../../../core/interfaces';

// import * as BACnetTypes from '../../../../core/bacnet/types';
import * as BACNet from 'tid-bacnet-logic';

export const AnalogInputMetadata: UnitPropertyObject[] = [
    {
        id: BACNet.Enums.PropertyId.objectType,
        payload: new BACNet.Types.BACnetEnumerated(BACNet.Enums.ObjectType.AnalogInput),
    },
    {
        id: BACNet.Enums.PropertyId.presentValue,
        payload: new BACNet.Types.BACnetReal(0.0),
    },
];
