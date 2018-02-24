import * as dgram from 'dgram';

import * as Bluebird from 'bluebird';

import { blvc } from '../layers/blvc.layer';

import { IBACnetDevice } from '../interfaces';

export class RequestSocket {
    public blvc: Map<string, any>;
    public npdu: Map<string, any>;
    public apdu: Map<string, any>;
    public device: IBACnetDevice;

    constructor (msg: Buffer, device: IBACnetDevice) {
        this.blvc = blvc.getFromBuffer(msg);
        this.npdu = this.blvc.get('npdu');
        this.apdu = this.npdu.get('apdu');
        this.device = device;
    }
}
