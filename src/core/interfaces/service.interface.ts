import {
    IUnconfirmReq,
    IUnconfirmReqCOVNotification,
    IUnconfirmReqWhoIs,
    IUnconfirmReqIAm,
} from './bacnet.interface';

export interface IServiceUnconfirmReqCOVNotification
    extends IUnconfirmReq, IUnconfirmReqCOVNotification {
}

export interface IServiceUnconfirmReqWhoIs
    extends IUnconfirmReq, IUnconfirmReqWhoIs {
}
export interface IServiceUnconfirmReqIAm
    extends IUnconfirmReq, IUnconfirmReqIAm {
}

import {
    ISimpleACK,
    ISimpleACKSubscribeCOV,
    ISimpleACKWriteProperty,
} from './bacnet.interface';

export interface IServiceSimpleACKSubscribeCOV
    extends ISimpleACK, ISimpleACKSubscribeCOV {
}

export interface IServiceSimpleACKWriteProperty
    extends ISimpleACK, ISimpleACKWriteProperty {
}

import {
    IComplexACK,
    IComplexACKReadProperty,
} from './bacnet.interface';

export interface IServiceComplexACKReadProperty
    extends IComplexACK, IComplexACKReadProperty {
}
