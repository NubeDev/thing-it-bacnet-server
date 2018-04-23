import { OutputSocket } from '../sockets';

export interface IEDEHeaderData {
    projectName: string;
    versionOfRefFile: number;
    authorOfLastChange: string;
    versionOfLayout: number;
}

export interface IEDEDevice {
    outputSoc: OutputSocket;
}
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
