import {
    UnitPropertyObject,
} from '../../../../core/interfaces';

import * as BACNet from 'tid-bacnet-logic';

export const CommandableMiddleMetadata: UnitPropertyObject[] = [
    {
        id: BACNet.Enums.PropertyId.presentValue,
        payload: new BACNet.Types.BACnetNull(),
    },
    {
        id: BACNet.Enums.PropertyId.relinquishDefault,
        payload: new BACNet.Types.BACnetNull(),
    },
    {
        id: BACNet.Enums.PropertyId.priorityArray,
        payload: [
            new BACNet.Types.BACnetNull(), // #1
            new BACNet.Types.BACnetNull(), // #2
            new BACNet.Types.BACnetNull(), // #3
            new BACNet.Types.BACnetNull(), // #4
            new BACNet.Types.BACnetNull(), // #5
            new BACNet.Types.BACnetNull(), // #6
            new BACNet.Types.BACnetNull(), // #7
            new BACNet.Types.BACnetNull(), // #8
            new BACNet.Types.BACnetNull(), // #9
            new BACNet.Types.BACnetNull(), // #10
            new BACNet.Types.BACnetNull(), // #11
            new BACNet.Types.BACnetNull(), // #12
            new BACNet.Types.BACnetNull(), // #13
            new BACNet.Types.BACnetNull(), // #14
            new BACNet.Types.BACnetNull(), // #15
            new BACNet.Types.BACnetNull(), // #16
        ],
    },
    {
        id: BACNet.Enums.PropertyId.currentCommandPriority,
        payload: new BACNet.Types.BACnetNull(),
    },
];
