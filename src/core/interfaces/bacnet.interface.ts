
import {
    BACnetPropTypes,
    BLVCFunction,
    BACnetPropIds,
    BACnetObjTypes,
    BACnetTagTypes,
} from '../enums';
import { BACnetWriterUtil } from '../utils';
import * as BACnetTypes from '../utils/types';

export interface IBACnetAddressInfo {
    address: string;
    port: number;
}

export interface IBACnetObjectProperty {
    id: BACnetPropIds;
    payload: BACnetTypes.BACnetTypeBase | BACnetTypes.BACnetTypeBase[];
    writable?: boolean;
    priority?: number;
}

export interface IBACnetTag {
    num: number;
    type: BACnetTagTypes;
    value: number;
}

export interface IBLVCReqLayer {
    func: BLVCFunction;
    npdu: BACnetWriterUtil;
    apdu: BACnetWriterUtil;
}

export interface INPDUReqLayer {
    control?: INPDULayerControl;
    destNetworkAddress?: number;
    destMacAddress?: string;
    srcNetworkAddress?: number;
    srcMacAddress?: string;
    hopCount?: number;
}

export interface INPDULayerControl {
    noApduMessageType?: boolean;
    destSpecifier?: boolean;
    srcSpecifier?: boolean;
    expectingReply?: boolean;
    priority1?: number;
    priority2?: number;
}

export interface IBACnetTypeObjectId {
    type: number; // enum
    instance: number;
}

export interface IBACnetTypeStatusFlags {
    inAlarm?: boolean,
    fault?: boolean,
    overridden?: boolean,
    outOfService?: boolean,
}
