
import {
    BACnetPropTypes,
    BLVCFunction,
    BACnetPropIds,
    BACnetObjTypes,
    BACnetTagTypes,
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
    deviceInstance?: number;
    type: BACnetObjTypes;
    instance: number;
    props: IBACnetObjectProperty[];
}

export interface IBACnetObjectProperty {
    id: BACnetPropIds;
    payload: IBACnetType;
    type?: BACnetPropTypes;
    writable?: boolean;
    priority?: number;
}

export interface IBACnetTag {
    num: number;
    type: BACnetTagTypes;
    value: number;
}
export interface IBACnetParam {
    tag: IBACnetTag;
    payload: IBACnetType;
}

export interface IBACnetPropertyNotification {
    id: BACnetPropIds;
    oldValue: IBACnetType;
    newValue: IBACnetType;
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
    unitObjId: IBACnetTypeObjectId;
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
    objId: IBACnetObjectProperty;
    vendorId: IBACnetObjectProperty;
}
export interface IUnconfirmReqCOVNotification {
    processId: IBACnetTypeUnsignedInt;
    devObjId: IBACnetTypeObjectId;
    unitObjId: IBACnetTypeObjectId;
    reportedProps: IBACnetObjectProperty[];
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
    unitObjId: IBACnetTypeObjectId;
    unitProp: IBACnetObjectProperty;
}

/**
 * BACnet types
 */
export type IBACnetType = IBACnetTypeBoolean | IBACnetTypeUnsignedInt
    | IBACnetTypeReal | IBACnetTypeEnumerated | IBACnetTypeStatusFlags
    | IBACnetTypeBitString | IBACnetTypeCharString | IBACnetTypeObjectId
    | IBACnetTypeBoolean[] | IBACnetTypeUnsignedInt[] | IBACnetTypeReal[]
    | IBACnetTypeEnumerated[] | IBACnetTypeStatusFlags[] | IBACnetTypeBitString[]
    | IBACnetTypeCharString[] | IBACnetTypeObjectId[];

export interface IBACnetTypeBoolean {
    value: boolean;
}

export interface IBACnetTypeUnsignedInt {
    value: number;
}

export interface IBACnetTypeReal {
    value: number;
}

export interface IBACnetTypeCharString {
    value: string;
}

export interface IBACnetTypeBitString {
    value: number;
}

export interface IBACnetTypeEnumerated {
    value: number;
}

export interface IBACnetTypeObjectId {
    type: number; // enum
    instance: number;
}

export interface IBACnetTypeStatusFlags {
    inAlarm: boolean,
    fault: boolean,
    overridden: boolean,
    outOfService: boolean,
}
