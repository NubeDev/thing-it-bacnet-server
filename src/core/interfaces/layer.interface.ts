import {
    BACnetServiceTypes,
    BLVCFunction,
    BACnetConfirmedService,
    BACnetUnconfirmedService,
} from '../enums';

import {
    IBACnetType,
    IBACnetParam,
} from './bacnet.interface';

/*
 * BLVC Layer
 */
export interface IBLVCLayer {
    type: number;
    func: BLVCFunction;
    length: number;
    npdu: INPDULayer;
}

/*
 * NPDU Layer
 */
export interface INPDULayer {
    version: number;
    control: INPDUControl;
    dest: INPDUDestNetwork;
    src: INPDUSrcNetwork;
    apdu: IAPDULayer;
}

export interface INPDUControl {
    noApduMessageType: boolean;
    reserved1: number;
    destSpecifier: boolean;
    reserved2: number;
    srcSpecifier: boolean;
    expectingReply: boolean;
    priority1: number;
    priority2: number;
}

export interface INPDUNetworkLayer {
    networkAddress: number;
    macAddressLen: number;
    macAddress?: string;
}

export interface INPDUDestNetwork
        extends INPDUNetworkLayer {
    hopCount?: number;
}

export interface INPDUSrcNetwork
        extends INPDUNetworkLayer {
}


/*
 * APDU Layer
 */
export type IAPDULayer = IConfirmedReqLayer | IUnconfirmedReqLayer
    | IComplexACKLayer | ISimpleACKLayer;

/*
 * Confirmed Request APDU Layer
 */
export interface IConfirmedReqLayer {
    type: BACnetServiceTypes;
    seg: boolean;
    mor: boolean;
    sa: boolean;
    maxSegs: number;
    maxResp: number;
    invokeId: number;
    serviceChoice: BACnetConfirmedService;
    service: IConfirmedReqService;
}

export type IConfirmedReqService = IConfirmedReqReadPropertyService
    | IConfirmedReqSubscribeCOVService
    | IConfirmedReqWritePropertyService;

export interface IConfirmedReqReadPropertyService {
    objId: IBACnetParam;
    propId: IBACnetParam;
}

export interface IConfirmedReqSubscribeCOVService {
    objId: IBACnetParam;
    subscriberProcessId: IBACnetParam;
    issConfNotif: IBACnetParam;
    lifeTime: IBACnetParam;
}

export interface IConfirmedReqWritePropertyService {
    objId: IBACnetParam;
    propId: IBACnetParam;
    propValues: IBACnetParam[];
    priority: number;
}

/*
 * Unconfirmed Request APDU Layer
 */
export interface IUnconfirmedReqLayer {
    type: BACnetServiceTypes;
    serviceChoice: BACnetUnconfirmedService;
    service: IUnconfirmedReqService;
}

export type IUnconfirmedReqService = IUnconfirmedReqIAmService
    | IUnconfirmedReqWhoIsService;

export interface IUnconfirmedReqIAmService {
    objId: IBACnetParam;
    maxAPDUlength: IBACnetParam;
    segmSupported: IBACnetParam;
    vendorId: IBACnetParam;
}

export interface IUnconfirmedReqWhoIsService {
}

/*
 * Complex ACK APDU Layer
 */
export interface IComplexACKLayer {
    type: BACnetServiceTypes;
    seg: boolean;
    mor: boolean;
    invokeId: number;
    sequenceNumber: number;
    proposedWindowSize: number;
    serviceChoice: BACnetConfirmedService;
    service: IComplexACKService;
}

export type IComplexACKService = IComplexACKReadPropertyService;

export interface IComplexACKReadPropertyService {
    objId: IBACnetParam;
    propId: IBACnetParam;
    propArrayIndex?: IBACnetParam;
    propValues?: IBACnetParam[];
}

/*
 * Simple ACK APDU Layer
 */
export interface ISimpleACKLayer {
    type: BACnetServiceTypes;
    invokeId: number;
    serviceChoice: BACnetConfirmedService;
    service: ISimpleACKService;
}

export type ISimpleACKService = ISimpleACKSubscribeCOVService
    | ISimpleACKWritePropertyService;

export interface ISimpleACKSubscribeCOVService {
}
export interface ISimpleACKWritePropertyService {
}
