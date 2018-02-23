import {
    BACNET_PROPERTY_KEYS,
    BACNET_OBJECT_TYPES,
    BACNET_PROP_TYPES,
} from '../enums';

export interface IBACnetModule {
    objects: IBACnetObject[];
}

export interface IBACnetObject {
    objType: BACNET_OBJECT_TYPES;
    props: IBACnetObjectProperty[];
    objects?: IBACnetObject[];
}

export interface IBACnetObjectProperty {
    propId: BACNET_PROPERTY_KEYS;
    propType: BACNET_PROP_TYPES;
    propValue: any;
}
