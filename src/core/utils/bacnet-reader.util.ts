import * as _ from 'lodash';

import { ApiError } from '../errors';

import { BACNET_PROPERTY_KEYS } from '../enums';

import { OffsetUtil } from '../utils';

export class BACnetReaderUtil {
    public offset: any;

    constructor (private buffer: Buffer) {
        this.offset = new OffsetUtil(0);
    }

    /**
     * readUInt8 - reads the 1 byte from the internal buffer.
     *
     * @return {number}
     */
    public readUInt8 (): number {
        return this.buffer.readUInt8(this.offset.inc());
    }

    /**
     * readUInt16BE - reads the 2 bytes from the internal buffer.
     *
     * @return {number}
     */
    public readUInt16BE (): number {
        return this.buffer.readUInt16BE(this.offset.inc(2));
    }

    /**
     * readObjectIdentifier - reads the 4 bytes from the internal buffer.
     *
     * @return {number}
     */
    public readUInt32BE (): number {
        return this.buffer.readUInt32BE(this.offset.inc(4));
    }

    /**
     * readObjectIdentifier - reads the BACnet object identifier from the internal
     * buffer and returns map with:
     * - tag = param tag (tag map)
     * - type = object type (number)
     * - instance = object instance (number)
     *
     * @return {Map<string, any>}
     */
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

    /**
     * readParam - reads the BACnet param from the internal buffer and returns
     * map with:
     * - tag = param tag (tag map)
     * - value = param value (number)
     *
     * @return {Map<string, any>}
     */
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

    /**
     * readProperty - reads the BACnet property from the internal buffer and
     * returns map with:
     * - tag = param tag (tag map)
     * - value = param value (number)
     * - name = param name (string)
     *
     * @return {Map<string, any>}
     */
    public readProperty (): Map<string, any> {
        const propMap: Map<string, any> = this.readParam();

        const propValue: number = propMap.get('value');
        const propName: string = BACNET_PROPERTY_KEYS[propValue];
        propMap.set('name', propName);

        return propMap;
    }

    /**
     * readListOfParams - stub
     */
    public readListOfParams (): Map<string, any> {
        const paramMap: Map<string, any> = new Map();

        const openTag = this.readTag();

        const property = this.readProperty();

        const closeTag = this.readTag();

        return paramMap;
    }

    /**
     * readTag - reads the BACnet tag from the internal buffer and returns map with:
     * - number = tag number (number)
     * - class = tag class (number)
     * - value = tag value (number)
     *
     * @return {Map<string, number>}
     */
    public readTag (): Map<string, number> {
        const typeMap: Map<string, number> = new Map();

        const tag = this.readUInt8();

        const tagNumber = tag >> 4;
        typeMap.set('number', tagNumber);

        const tagClass = (tag >> 3) & 0x01;
        typeMap.set('class', tagClass);

        const tagValue = tag & 0x07;
        typeMap.set('value', tagValue);

        return typeMap;
    }
}
