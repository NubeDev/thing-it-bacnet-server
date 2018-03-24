
import {
    BACnetPropTypes,
    BLVCFunction,
    BACnetPropIds,
    BACnetObjTypes,
} from '../enums';
import { BACnetWriterUtil } from '../utils';

export interface IBACnetObjectIdentifier {
    type: number;
    instance: number;
}
export interface IBACnetAddressInfo {
    address: string;
    port: number;
}

export interface IBACnetDevice extends IBACnetObject {
    vendorId?: number;
    objects?: IBACnetObject[];
}

export interface IBACnetObject {
    type: BACnetObjTypes;
    instance: number;
    props: IBACnetObjectProperty[];
}

export interface IBACnetObjectProperty {
    id: BACnetPropIds;
    type: BACnetPropTypes;
    payload: any;
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

export interface IConfirmedReq {
    segAccepted?: boolean;
    invokeId: number;
}
export interface IConfirmedReqReadProperty {
    objType: number;
    objInst: number;
    propId: number;
    propArrayIndex?: number;
}
export interface IConfirmedReqReadPropertyOptions
    extends IConfirmedReq, IConfirmedReqReadProperty {
}

export interface IUnconfirmReq {
}
export interface IUnconfirmReqWhoIs {
}
export interface IUnconfirmReqWhoIsOptions
    extends IUnconfirmReq, IUnconfirmReqWhoIs {
}
export interface IUnconfirmReqIAm {
    objType: number;
    objInst: number;
    vendorId: number;
}
export interface IUnconfirmReqCOVNotification {
    processId: number;
    device: IBACnetObject;
    devObject: IBACnetObject;
    prop: IBACnetObjectProperty;
    status: IBACnetObjectProperty;
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
