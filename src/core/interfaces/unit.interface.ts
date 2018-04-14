import { BACnetTagTypes } from '../enums';

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
