import {
    BACnetPropertyId,
    BACnetObjectType,
    BACnetPropTypes,
} from '../../../../core/enums';

import {
    IBACnetObjectProperty,
} from '../../../../core/interfaces';

import * as BACnetTypes from '../../../../core/types';

export const CommandableMiddleMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropertyId.presentValue,
        payload: new BACnetTypes.BACnetNull(),
    },
    {
        id: BACnetPropertyId.relinquishDefault,
        payload: new BACnetTypes.BACnetNull(),
    },
    {
        id: BACnetPropertyId.priorityArray,
        payload: [
            new BACnetTypes.BACnetNull(), // #1
            new BACnetTypes.BACnetNull(), // #2
            new BACnetTypes.BACnetNull(), // #3
            new BACnetTypes.BACnetNull(), // #4
            new BACnetTypes.BACnetNull(), // #5
            new BACnetTypes.BACnetNull(), // #6
            new BACnetTypes.BACnetNull(), // #7
            new BACnetTypes.BACnetNull(), // #8
            new BACnetTypes.BACnetNull(), // #9
            new BACnetTypes.BACnetNull(), // #10
            new BACnetTypes.BACnetNull(), // #11
            new BACnetTypes.BACnetNull(), // #12
            new BACnetTypes.BACnetNull(), // #13
            new BACnetTypes.BACnetNull(), // #14
            new BACnetTypes.BACnetNull(), // #15
            new BACnetTypes.BACnetNull(), // #16
        ],
    },
    {
        id: BACnetPropertyId.currentCommandPriority,
        payload: new BACnetTypes.BACnetNull(),
    },
];
