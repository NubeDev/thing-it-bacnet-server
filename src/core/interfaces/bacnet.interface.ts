
import {
    BACnetPropTypes,
    BLVCFunction,
} from '../enums';
import { BACnetWriterUtil } from '../utils';

export interface IBLVCLayer {
    func: BLVCFunction;
    npdu: BACnetWriterUtil;
    apdu: BACnetWriterUtil;
}

export interface INPDULayer {
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

export interface IUnconfirmReq {
}
export interface IUnconfirmReqIAm {
    objType: number;
    objInst: number;
    vendorId: number;
}
export interface IUnconfirmReqCOVNotification {
    processId: number;
    devObjType: number;
    devObjInst: number;
    portObjType: number;
    portObjInst: number;
    propId: number;
    propValue: any;
    propType: BACnetPropTypes;
    statusValue: any;
}

export interface ISimpleACK {
    invokeId: number;
}

export interface ISimpleACKSubscribeCOV {
}

export interface ISimpleACKWriteProperty {
}

export interface IComplexACK {
    seg?: boolean;
    mor?: boolean;
    invokeId: number;
}

export interface IComplexACKReadProperty {
    objType: number;
    objInst: number;
    propId: number;
    propValue: any;
    propType: BACnetPropTypes;
}
