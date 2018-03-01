
export interface IBACnetModule {
    port: number;
    device: INativeUnit;
    units: IUnit;
}

export interface IUnit {
    name?: string;
    config: any;
}
export interface INativeUnit extends IUnit {
    id: number;
    vendorId?: number;
}

export interface IDeviceUnit extends INativeUnit {
    config: IDeviceUnitConfig;
}
export interface IDeviceUnitConfig {
    objectNameProp?: IBACnetTypeCharString;
    descriptionProp?: IBACnetTypeCharString;
    vendorNameProp?: IBACnetTypeCharString;
    modelNameProp?: IBACnetTypeCharString;
}

export interface IBinaryValueUnit extends INativeUnit {
    config: IBinaryValueUnitConfig;
}
export interface IBinaryValueUnitConfig {
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
