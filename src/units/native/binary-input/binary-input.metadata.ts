import {
    BACnetPropIds,
    BACnetObjTypes,
    BACnetPropTypes,
    BACnetBinaryPV,
    BACnetPolarity,
    BACnetEventState,
    BACnetReliability,
} from '../../../core/enums';

import {
    IBACnetObjectProperty,
} from '../../../core/interfaces';

export const BinaryInputMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropIds.objectType,
        type: BACnetPropTypes.enumerated,
        payload: {
            value: BACnetObjTypes.BinaryInput,
        },
    },
    {
        id: BACnetPropIds.outOfService,
        type: BACnetPropTypes.boolean,
        payload: {
            value: false,
        },
    },
    {
        id: BACnetPropIds.presentValue,
        type: BACnetPropTypes.enumerated,
        payload: {
            value: BACnetBinaryPV.Active,
        },
    },
    {
        id: BACnetPropIds.polarity,
        type: BACnetPropTypes.enumerated,
        payload: {
            value: BACnetPolarity.Normal,
        },
    },
    {
        id: BACnetPropIds.eventState,
        type: BACnetPropTypes.enumerated,
        payload: {
            value: BACnetEventState.Normal,
        },
    },
    {
        id: BACnetPropIds.reliability,
        type: BACnetPropTypes.enumerated,
        payload: {
            value: BACnetReliability.NoFaultDetected,
        },
    },
    {
        id: BACnetPropIds.statusFlags,
        type: BACnetPropTypes.bitString,
        payload: {
            inAlarm: false,
            fault: false,
            overridden: false,
            outOfService: false,
        },
    },
];
