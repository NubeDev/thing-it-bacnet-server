import {
    BACnetUnsignedInteger,
    BACnetObjectId,
    BACnetTypeBase,
} from '../utils/types';

import {
    IBACnetObjectProperty,
} from './bacnet.interface';

/**
 * Unconfirmed Request
 */
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
     processId: number;
     devObjId: BACnetObjectId;
     unitObjId: BACnetObjectId;
     reportedProps: IBACnetObjectProperty[];
 }


export interface IServiceUnconfirmReqCOVNotification
    extends IUnconfirmReq, IUnconfirmReqCOVNotification {
}
export interface IServiceUnconfirmReqWhoIs
    extends IUnconfirmReq, IUnconfirmReqWhoIs {
}
export interface IServiceUnconfirmReqIAm
    extends IUnconfirmReq, IUnconfirmReqIAm {
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
