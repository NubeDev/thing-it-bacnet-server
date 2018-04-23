import {
    BACnetPropIds,
    BACnetObjectType,
    BACnetPropTypes,
    BACnetBinaryPV,
    BACnetPolarity,
    BACnetEventState,
    BACnetReliability,
} from '../../../../core/enums';

import {
    IBACnetObjectProperty,
} from '../../../../core/interfaces';

import * as BACnetTypes from '../../../../core/types';

export const StatusFlagsMiddleMetadata: IBACnetObjectProperty[] = [
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
