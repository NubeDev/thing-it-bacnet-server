import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';

import {
    BACnetObjTypes,
} from './enums';

import { IBACnetDevice, IBACnetObject, IBACnetObjectProperty } from './interfaces';

type ObjSubject = BehaviorSubject<void>;
type ObjIdent = number;

export class Device {
    private device: IBACnetDevice;
    private objSubjects: Map<BACnetObjTypes, Map<ObjIdent, ObjSubject>>;

    constructor (device: IBACnetDevice) {
        this.initDevice(device);
    }

    public getDevice (): IBACnetDevice {
        return _.cloneDeep(this.device);
    }

    public initDevice (device: IBACnetDevice): void {
        this.device = _.cloneDeep(device);

        // Init "Subject" storage for each object
        this.objSubjects = new Map();
        _.map(this.device.objects, (obj) => {
            if (!this.objSubjects.has(obj.type)) {
                this.objSubjects.set(obj.type, new Map());
            }
            const typeMap = this.objSubjects.get(obj.type);
            typeMap.set(obj.id, new BehaviorSubject(null));
        });
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
            return _.cloneDeep(this.device);
        }
        const bnObject = _.find(this.device.objects, { 'id': id, 'type': type });
        return _.cloneDeep(bnObject);
    }

    /**
     * subscribe - subscribes to the changing properties of BACnet object.
     *
     * @param  {number} id - object identifier
     * @param  {number} type - object type
     * @param  {Function} fn - callback
     * @return {void}
     */
    public subscribe (id: number, type: number, fn: () => any): void {
        const typeMap = this.objSubjects.get(type);
        typeMap.get(id).subscribe(fn);
    }

    /**
     * next - emits "change" event for specific BACnet object.
     *
     * @param  {number} id - object identifier
     * @param  {number} type - object type
     * @return {void}
     */
    public next (id: number, type: number): void {
        const typeMap = this.objSubjects.get(type);
        typeMap.get(id).next(null);
    }

    /**
     * next - emits "change" event for specific BACnet object.
     *
     * @param  {number} id - object identifier
     * @param  {number} type - object type
     * @return {void}
     */
    public setPropertyValue (objId: number, objType: number, propId: number, propValue: any): void {
        let bnObject: IBACnetObject;
        if (this.device.id === objId && this.device.type === objType) {
            bnObject = _.cloneDeep(this.device);
        }
        bnObject = _.find(this.device.objects, { 'id': objId, 'type': objType });
        const prop = _.find(bnObject.props, [ 'id', propId ]);
        prop.values = propValue;
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
