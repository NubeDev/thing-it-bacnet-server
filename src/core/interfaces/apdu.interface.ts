
import { BACNET_PROP_TYPES } from '../enums';

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
    propType: BACNET_PROP_TYPES;
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
    propType: BACNET_PROP_TYPES;
}
