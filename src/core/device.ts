import * as _ from 'lodash';

import { IBACnetDevice, IBACnetObject, IBACnetObjectProperty } from './interfaces';

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

    /**
     * getObject - returns the object from BACnet module.
     *
     * @param  {number} id - object identifier
     * @param  {number} type - object type
     * @return {IBACnetObject}
     */
    public getObject (id: number, type: number): IBACnetObject {
        if (this.device.id === id && this.device.type === type) {
            return this.device;
        }
        const bnObject = _.find(this.device.objects, { 'id': id, 'type': type });
        return bnObject;
    }

    /**
     * getProperty - returns the property from BACnet object.
     *
     * @param  {IBACnetObject} bnObject - BACnet object
     * @param  {number} propId - property identifier
     * @return {IBACnetObjectProperty}
     */
    public getProperty (bnObject: IBACnetObject, propId: number): IBACnetObjectProperty {
        if (!bnObject) {
            return null;
        }
        const prop = _.find(bnObject.props, [ 'id', propId ]);
        return _.cloneDeep(prop);
    }
}
