import {
    BACnetPropIds,
    BACnetObjTypes,
    BACnetPropTypes,
    BACnetEngineeringUnits,
} from '../../../../core/enums';

import {
    IBACnetObjectProperty,
} from '../../../../core/interfaces';

import * as BACnetTypes from '../../../../core/utils/types';

export const AnalogValueMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropIds.objectType,
        payload: new BACnetTypes.BACnetEnumerated(BACnetObjTypes.AnalogValue),
    },

    {
        id: BACnetPropIds.units,
        payload: new BACnetTypes.BACnetEnumerated(BACnetEngineeringUnits.noUnits),
    },
    {
        id: BACnetPropIds.covIncrement,
        payload: new BACnetTypes.BACnetReal(1.0),
    },
    {
        id: BACnetPropIds.presentValue,
        payload: new BACnetTypes.BACnetReal(0.0),
    },
    {
        id: BACnetPropIds.relinquishDefault,
        payload: new BACnetTypes.BACnetReal(0.0),
    },
    {
        id: BACnetPropIds.priorityArray,
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
        id: BACnetPropIds.currentCommandPriority,
        payload: new BACnetTypes.BACnetNull(),
    },
];
