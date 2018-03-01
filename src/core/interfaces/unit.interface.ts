
export interface IDeviceUnit {
    id: number;
    vendor: number;
    config: IDeviceUnitConfig;
    units: IUnit[];
}
export interface IDeviceUnitConfig {
    objectNameProp?: IBACnetTypeCharString;
    descriptionProp?: IBACnetTypeCharString;
    vendorNameProp?: IBACnetTypeCharString;
    modelNameProp?: IBACnetTypeCharString;
}

export interface IUnit {
    name: string;
    config: any;
}

export interface IBinaryValueUnit {
    config: IBinaryValueUnitConfig;
}
export interface IBinaryValueUnitConfig {
    id: number;
    presentValue?: IBACnetTypeEnumerated;
    statusFlags?: IBACnetTypeStatusFlags;
}


/**
 * BACnet types
 */
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

export interface IBACnetTypeStatusFlags {
    inAlarm: boolean,
    fault: boolean,
    overridden: boolean,
    outOfService: boolean,
}
