import {
    BACnetPropIds,
    BACnetObjTypes,
    BACnetPropTypes,
} from '../enums';

export interface IBACnetModule {
    port: number;
    device: IBACnetDevice;
}

export interface IBACnetDevice {
    id: number;
    type: BACnetObjTypes;
    vendorId?: number;
    props: IBACnetObjectProperty[];
    objects?: IBACnetObject[];
}

export interface IBACnetObject {
    type: BACnetObjTypes;
    props: IBACnetObjectProperty[];
}

export interface IBACnetObjectProperty {
    id: BACnetPropIds;
    type: BACnetPropTypes;
    values: any;
}
