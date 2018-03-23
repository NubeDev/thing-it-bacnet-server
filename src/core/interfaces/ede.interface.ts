import { CSVRow } from '../csv/row.csv';
import { OutputSocket } from '../sockets';
import { IBACnetTypeCharString } from './unit.interface';

import {
    IBACnetObjectIdentifier,
    IBACnetAddressInfo,
} from './bacnet.interface';

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
    props: IEDEUnitProps;
}
export interface IEDEUnitProps {
    objId: IBACnetObjectIdentifier;
    deviceId: IBACnetObjectIdentifier;
    objectName?: IBACnetTypeCharString;
    description?: IBACnetTypeCharString;
}
