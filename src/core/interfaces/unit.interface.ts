import { BACnetTagTypes } from '../enums';

export interface IBACnetModule {
    port: number;
    device: INativeUnit;
    units: Array<INativeUnit|ICustomUnit>;
}

export interface INativeUnit {
    id: number;
    name?: string;
    alias?: string;
    vendorId?: number;
    props?: any;
}
export interface ICustomUnit {
    name?: string;
    units: INativeUnit[];
}
