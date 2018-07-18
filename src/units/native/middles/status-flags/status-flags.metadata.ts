import {
    UnitPropertyObject,
} from '../../../../core/interfaces';

import * as BACNet from 'tid-bacnet-logic';

export const StatusFlagsMiddleMetadata: UnitPropertyObject[] = [
    {
        id: BACNet.Enums.PropertyId.outOfService,
        payload: new BACNet.Types.BACnetBoolean(false),
    },
    {
        id: BACNet.Enums.PropertyId.reliability,
        payload: new BACNet.Types.BACnetEnumerated(BACNet.Enums.Reliability.NoFaultDetected),
    },
    {
        id: BACNet.Enums.PropertyId.eventState,
        payload: new BACNet.Types.BACnetEnumerated(BACNet.Enums.EventState.Normal),
    },
    {
        id: BACNet.Enums.PropertyId.statusFlags,
        payload: new BACNet.Types.BACnetStatusFlags({
            inAlarm: false,
            fault: false,
            overridden: false,
            outOfService: false,
        }),
    },
];
