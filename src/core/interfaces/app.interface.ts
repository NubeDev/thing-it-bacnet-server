import {
    BACnetPropIds,
    BACnetObjTypes,
    BACnetPropTypes,
} from '../enums';

export interface IBACnetModule {
    objects: IBACnetObject[];
}

export interface IBACnetObject {
    objType: BACnetObjTypes;
    props: IBACnetObjectProperty[];
    objects?: IBACnetObject[];
}

export interface IBACnetObjectProperty {
    propId: BACnetPropIds;
    propType: BACnetPropTypes;
    propValue: any;
}
