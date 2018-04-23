import {
    BACnetUnsignedInteger,
    BACnetObjectId,
    BACnetTypeBase,
} from '../types';

import {
    IBACnetObjectProperty,
} from './bacnet.interface';

/**
 * Unconfirmed Request
 */
export interface IUnconfirmedReq {
}
export interface IUnconfirmedReqWhoIs {
}
export interface IUnconfirmedReqWhoIsOptions
    extends IUnconfirmedReq, IUnconfirmedReqWhoIs {
}
export interface IUnconfirmedReqIAm {
    objId: IBACnetObjectProperty;
    vendorId: IBACnetObjectProperty;
}
export interface IUnconfirmedReqCOVNotification {
    processId: BACnetUnsignedInteger;
    devObjId: BACnetObjectId;
    unitObjId: BACnetObjectId;
    reportedProps: IBACnetObjectProperty[];
}

export interface IServiceUnconfirmedReqCOVNotification
    extends IUnconfirmedReq, IUnconfirmedReqCOVNotification {
}
export interface IServiceUnconfirmedReqWhoIs
    extends IUnconfirmedReq, IUnconfirmedReqWhoIs {
}
export interface IServiceUnconfirmedReqIAm
    extends IUnconfirmedReq, IUnconfirmedReqIAm {
}


/**
 * Confirmed Request
 */
export interface IConfirmedReq {
    segAccepted?: boolean;
    invokeId: number;
}
export interface IConfirmedReqReadProperty {
    unitObjId: BACnetObjectId;
    propId: number;
    propArrayIndex?: number;
}

export interface IServiceConfirmedReqReadProperty
    extends IConfirmedReq, IConfirmedReqReadProperty {
}


/**
 * Simple ACK
 */
export interface ISimpleACK {
    invokeId: number;
}
export interface ISimpleACKSubscribeCOV {
}
export interface ISimpleACKWriteProperty {
}

export interface IServiceSimpleACKSubscribeCOV
    extends ISimpleACK, ISimpleACKSubscribeCOV {
}
export interface IServiceSimpleACKWriteProperty
    extends ISimpleACK, ISimpleACKWriteProperty {
}


/**
 * Complex ACK
 */
export interface IComplexACK {
    seg?: boolean;
    mor?: boolean;
    invokeId: number;
}
export interface IComplexACKReadProperty {
    unitObjId: BACnetObjectId;
    unitProp: IBACnetObjectProperty;
}

export interface IServiceComplexACKReadProperty
    extends IComplexACK, IComplexACKReadProperty {
}
