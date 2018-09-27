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
    config: ICustomFunctionConfig|ITemperatureFunctionConfig|ISetpointFunctionConfig|IModeFunctionConfig;
}

export interface ICustomFunction <T> {
    unit: T;
    config: ICustomFunctionConfig;
}

export interface ICustomFunctionConfig {
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

export interface ITemperatureFunctionConfig extends ICustomFunctionConfig {

}

export interface IModeFunctionConfig {
    stateText: string[];
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
