import { AddressInfo } from 'net';
export interface ContainersInfo {
    port: number;
    name: string;
    remoteTINOutput?: AddressInfo;
};
