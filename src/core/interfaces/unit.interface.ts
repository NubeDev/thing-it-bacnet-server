import * as BACNet from 'tid-bacnet-logic';
/**
 * EDE
 */

export interface IEDEUnit {
    keyname: string;
    deviceInst: number;
    objName: string;
    objType: number;
    objInst: number;
    description: string;
    defPresentValue: number;
    minPresentValue: number;
    maxPresentValue: number;
    commandable: string;
    supportCOV: string;
    hiLimit: number;
    liLimit: number;
    stateTextRef: number;
    unitCode: number;
    vendorAddr: string;
    // Custom cells
    custUnitType: string;
    custUnitId: number;
    custUnitFn: string;
    custUnitMax: number;
    custUnitMin: number;
    custUnitFreq: number;
}

/**
 * Custom Units
 */

export interface ICustomMetadata {
    alias: string|string[];
    config: ICustomFunctionConfigDefault|ITemperatureFunctionConfig|ISetpointFunctionConfig|IModeFunctionConfig;
}

export interface ICustomFunction <T> {
    unit: T;
    config: ICustomFunctionConfigDefault|ISetpointFunctionConfig|IModeFunctionConfig|ITemperatureFunctionConfig;
}

export interface ICustomFunctionConfig {
    // Min value
    min?: number;
    // Max value
    max?: number;
    // Frequency
    freq?: number;
    staeteText?: string[];
}

export interface ICustomMetadataDefault {
    alias: string|string[];
    config: ICustomFunctionConfigDefault;
}

export interface ICustomFunctionDefault <T> {
    unit: T;
    config: ICustomFunctionConfigDefault;
}


export interface ICustomFunctionConfigDefault {
    // Min value
    min: number;
    // Max value
    max: number;
    // Frequency
    freq: number;
}

export interface IThermostatMetadata {
    alias: string|string[];
    config: ISetpointFunctionConfig|ITemperatureFunctionConfig|IModeFunctionConfig;
}

export interface ISetpointFunctionConfig {
    min: number;
    max: number;
}

export interface ISetpointFunction <T> {
    unit: T;
    config: ISetpointFunctionConfig;
}

export interface ITemperatureFunctionConfig extends ICustomFunctionConfigDefault {

}

export interface ITemperatureFunction <T> {
    unit: T;
    config: ITemperatureFunctionConfig;
}

export interface IModeFunctionConfig {
    stateText: string[];
}

export interface IModeFunction <T> {
    unit: T;
    config: IModeFunctionConfig;
}

export interface UnitStorageProperty {
    id: BACNet.Enums.PropertyId;
    payload: BACNet.Types.BACnetTypeBase | BACNet.Types.BACnetTypeBase[];
    writable?: boolean;
    priority?: number;
}

/**
 * State texts
 */

export interface IStateTextsUnit {
    referenceNumber: number;
    inactiveText?: string;
    activeText?: string;
    stateTextsArray: string[];
}
