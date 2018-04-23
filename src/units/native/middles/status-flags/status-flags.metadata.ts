import {
    BACnetPropertyId,
    BACnetObjectType,
    BACnetPropTypes,
    BACnetBinaryPV,
    BACnetPolarity,
    BACnetEventState,
    BACnetReliability,
} from '../../../../core/bacnet/enums';

import {
    IBACnetObjectProperty,
} from '../../../../core/bacnet/interfaces';

import * as BACnetTypes from '../../../../core/bacnet/types';

export const StatusFlagsMiddleMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropertyId.outOfService,
        payload: new BACnetTypes.BACnetBoolean(false),
    },
    {
        id: BACnetPropertyId.reliability,
        payload: new BACnetTypes.BACnetEnumerated(BACnetReliability.NoFaultDetected),
    },
    {
        id: BACnetPropertyId.eventState,
        payload: new BACnetTypes.BACnetEnumerated(BACnetEventState.Normal),
    },
    {
        id: BACnetPropertyId.statusFlags,
        payload: new BACnetTypes.BACnetStatusFlags({
            inAlarm: false,
            fault: false,
            overridden: false,
            outOfService: false,
        }),
    },
];
