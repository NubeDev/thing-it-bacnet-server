import {
    BACnetPropIds,
    BACnetObjTypes,
    BACnetPropTypes,
    BACnetBinaryPV,
    BACnetPolarity,
    BACnetEventState,
    BACnetReliability,
} from '../../../../core/enums';

import {
    IBACnetObjectProperty,
} from '../../../../core/interfaces';

import * as BACnetTypes from '../../../../core/utils/types';

export const BinaryValueMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropIds.objectType,
        payload: new BACnetTypes.BACnetEnumerated(BACnetObjTypes.BinaryValue),
    },

    {
        id: BACnetPropIds.presentValue,
        payload: new BACnetTypes.BACnetEnumerated(BACnetBinaryPV.Active),
    },
    {
        id: BACnetPropIds.relinquishDefault,
        payload: new BACnetTypes.BACnetEnumerated(BACnetBinaryPV.Active),
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

    {
        id: BACnetPropIds.outOfService,
        payload: new BACnetTypes.BACnetBoolean(false),
    },
    {
        id: BACnetPropIds.reliability,
        payload: new BACnetTypes.BACnetEnumerated(BACnetReliability.NoFaultDetected),
    },
    {
        id: BACnetPropIds.eventState,
        payload: new BACnetTypes.BACnetEnumerated(BACnetEventState.Normal),
    },
    {
        id: BACnetPropIds.statusFlags,
        payload: new BACnetTypes.BACnetStatusFlags({
            inAlarm: false,
            fault: false,
            overridden: false,
            outOfService: false,
        }),
    },
];
