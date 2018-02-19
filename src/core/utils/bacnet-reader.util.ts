import * as _ from 'lodash';

import { ApiError } from '../errors';

import { BACNET_PROPERTY_KEYS } from '../enums';

import { OffsetUtil } from '../utils';

export class BACnetReaderUtil {
    private offset: any;

    constructor (private buffer: Buffer) {
        this.offset = new OffsetUtil(0);
    }

    public readUInt8 () {
        return this.buffer.readUInt8(this.offset.inc());
    }

    public readUInt16BE () {
        return this.buffer.readUInt16BE(this.offset.inc(2));
    }

    public readUInt32BE () {
        return this.buffer.readUInt32BE(this.offset.inc(4));
    }

    public readObjectIdentifier (): Map<string, any> {
        const objMap: Map<string, any> = new Map();

        const tag = this.readTag();
        objMap.set('tag', tag);

        const objIdentifier = this.readUInt32BE();

        const objType = (objIdentifier >> 22) & 0x03FF;
        objMap.set('type', objType);

        const objInstance = (objIdentifier) & 0x03FFFFF;
        objMap.set('instance', objInstance);

        return objMap;
    }

    public readParam (): Map<string, any> {
        const paramMap: Map<string, any> = new Map();

        const tag = this.readTag();
        paramMap.set('tag', tag);

        let param;
        const len: number = tag.get('value');
        if (len === 1) {
            param = this.readUInt8();
        } else if (len === 2) {
            param = this.readUInt16BE();
        } else if (len === 4) {
            param = this.readUInt32BE();
        }

        paramMap.set('value', param);

        return paramMap;
    }

    public readProperty (): Map<string, any> {
        const propMap: Map<string, any> = this.readParam();

        const propValue: number = propMap.get('value');
        const propName: string = BACNET_PROPERTY_KEYS[propValue];
        propMap.set('name', propName);

        return propMap;
    }

    public readListOfParams (): Map<string, any> {
        const paramMap: Map<string, any> = new Map();

        const openTag = this.readTag();

        const property = this.readProperty();

        const closeTag = this.readTag();

        return paramMap;
    }

    public readTag (): Map<string, number> {
        const typeMap: Map<string, number> = new Map();

        const tag = this.buffer.readUInt8(this.offset.inc());

        const tagNumber = tag >> 4;
        typeMap.set('number', tagNumber);

        const tagClass = (tag >> 3) & 0x01;
        typeMap.set('class', tagClass);

        const tagValue = tag & 0x07;
        typeMap.set('value', tagValue);

        return typeMap;
    }
}
