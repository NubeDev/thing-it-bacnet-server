import {
    BACnetPropertyId,
    BACnetObjectType,
    BACnetPropTypes,
} from '../../../../core/enums';

import {
    UnitPropertyObject,
} from '../../../../core/interfaces';

//import * as BACnetTypes from '../../../../core/bacnet/types';
import * as BACNet from 'tid-bacnet-logic';

export const MultiStateValueMetadata: UnitPropertyObject[] = [
    {
        id: BACNet.Enums.PropertyId.objectType,
        payload: new BACNet.Types.BACnetEnumerated(BACNet.Enums.ObjectType.MultiStateValue),
    },
];
