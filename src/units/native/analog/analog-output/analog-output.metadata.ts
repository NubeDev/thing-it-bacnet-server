// import {
//     BACnetPropertyId,
//     BACnetObjectType,
//     BACnetPropTypes,
//     BACnetEngineeringUnits
// } from '../../../../core/enums';

import {
    UnitPropertyObject,
} from '../../../../core/interfaces';

// import * as BACnetTypes from '../../../../core/bacnet/types';
import * as BACNet from 'tid-bacnet-logic';

export const AnalogOutputMetadata: UnitPropertyObject[] = [
    {
        id: BACNet.Enums.PropertyId.objectType,
        payload: new BACNet.Types.BACnetEnumerated(BACNet.Enums.ObjectType.AnalogOutput),
    },
    {
        id: BACNet.Enums.PropertyId.relinquishDefault,
        payload: new BACNet.Types.BACnetReal(0.0),
    },
    {
        id: BACNet.Enums.PropertyId.presentValue,
        payload: new BACNet.Types.BACnetReal(0.0),
    },
];
