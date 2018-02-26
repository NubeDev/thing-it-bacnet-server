import * as _ from 'lodash';

import { IBACnetDevice } from './interfaces';

export class Device {
    private device: IBACnetDevice;

    constructor (device: IBACnetDevice) {
        this.initDevice(device);
    }

    public getDevice (): IBACnetDevice {
        return _.cloneDeep(this.device);
    }

    public initDevice (device: IBACnetDevice): void {
        this.device = _.cloneDeep(device);
    }
}
