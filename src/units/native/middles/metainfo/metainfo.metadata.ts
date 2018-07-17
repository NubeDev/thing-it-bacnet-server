// import {
//     BACnetPropertyId,
// } from '../../../../core/bacnet/enums';

import {
    UnitPropertyObject,
} from '../../../../core/interfaces';

// import * as BACnetTypes from '../../../../core/bacnet/types';

import * as BACNet from 'tid-bacnet-logic';

export const MetainfoMiddleMetadata: UnitPropertyObject[] = [
    {
        id: BACNet.Enums.PropertyId.objectIdentifier,
        payload: new BACNet.Types.BACnetObjectId(),
    },
    {
        id:  BACNet.Enums.PropertyId.objectName,
        payload: new BACNet.Types.BACnetCharacterString('[thing-it] Test Device Name'),
    },
    {
        id: BACNet.Enums.PropertyId.objectType,
        payload: new BACNet.Types.BACnetEnumerated(),
    },
    {
        id: BACNet.Enums.PropertyId.description,
        payload: new BACNet.Types.BACnetCharacterString('[thing-it] Test Device Description'),
    },
];
