import * as _ from 'lodash';

import { ApiError } from '../errors';

import {
    BACNET_PROPERTY_KEYS,
    BACNET_PROP_TYPES,
    getTypeSize,
} from '../enums';

import { OffsetUtil } from '../utils';

export class BACnetReaderUtil {
    public offset: any;

    constructor (private buffer: Buffer) {
        this.offset = new OffsetUtil(0);
    }

    /**
     * writeUInt8 - writes 1 byte to the interanal buffer.
     *
     * @param  {number} value - data
     * @return {void}
     */
    public writeUInt8 (value: number): void {
        this.buffer.writeUInt8(value, this.offset.inc());
    }

    /**
     * writeUInt16BE - writes 2 bytes to the interanal buffer.
     *
     * @param  {number} value - data
     * @return {void}
     */
    public writeUInt16BE (value: number): void {
        this.buffer.writeUInt16BE(value, this.offset.inc(2));
    }

    /**
     * writeUInt32BE - writes 4 bytes (integer) to the interanal buffer.
     *
     * @param  {number} value - data
     * @return {void}
     */
    public writeUInt32BE (value: number): void {
        this.buffer.writeUInt32BE(value, this.offset.inc(4));
    }

    /**
     * writeFloatBE - writes 4 bytes (real) to the interanal buffer.
     *
     * @param  {number} value - data
     * @return {void}
     */
    public writeFloatBE (value: number): void {
        this.buffer.writeFloatBE(value, this.offset.inc(4));
    }

    /**
     * writeString - reads the N bytes from the internal buffer and converts
     * the result to the string.
     *
     * @param  {string} encoding - character encoding
     * @param  {number} len - lenght of string
     * @return {string}
     */
    public writeString (str: string, encoding: string = 'utf8'): void {
        const strLen = str.length;
        const offStart = this.offset.inc(strLen);
        this.buffer.write(str, offStart, strLen, encoding);
    }

    /**
     * writeTag - writes BACnet tag to the interanal buffer.
     *
     * @param  {number} tagNumber - tag number/context
     * @param  {number} tagClass - tag class
     * @param  {number} tagValue - tag value
     * @return {void}
     */
    public writeTag (
            tagNumber: number, tagClass: number, tagValue: number): void {
        // Tag = Tag Number 4 bits, Tag Class 1 bits, Tag Value 3 bits
        const tag = ((tagNumber & 0x0F) << 4)
            | ((tagClass & 0x01) << 3)
            | (tagValue & 0x07);
        this.writeUInt8(tag);
    }

    /**
     * writeObjectIdentifier - writes BACnet object identifier to the interanal buffer.
     *
     * @param  {number} tagContext - tag context
     * @param  {number} objectType - object type
     * @param  {number} objectId - object id
     * @return {void}
     */
    public writeObjectIdentifier (
            tagContext: number, objectType: number, objectId: number): void {
        // Context Number - Context tag - ObjIdent Length (bytes)
        this.writeTag(tagContext, 1, 4);

        // Object Identifier = Object Type 10 bits, Object ID 22 bits
        const objectIdentifier = ((objectType & 0x03FF) << 22)
            | (objectId & 0x03FFFFF);
        this.writeUInt32BE(objectIdentifier);
    }

    /**
     * writeParam - writes BACnet param name to the interanal buffer.
     *
     * @param  {number} tagContext - tag context
     * @param  {number} paramName - param name
     * @param  {number} paramSize - param size
     * @return {void}
     */
    public writeParam (
            tagContext: number, paramName: number, paramSize: number = 1): void {
        // Context Number - Context tag - Param Length (bytes)
        this.writeTag(tagContext, 1, paramSize);

        // Write param by the param length
        switch (paramSize) {
            case 4:
                this.writeUInt32BE(paramName);
                break;
            case 2:
                this.writeUInt16BE(paramName);
                break;
            case 1:
                this.writeUInt8(paramName);
                break;
            default:
                throw new ApiError(`BACnetReaderUtil - writeIntBySizte: Size ${paramSize} is not supported!`);
        }
    }

    /**
     * writeValue - writes BACnet param value to the interanal buffer.
     *
     * @param  {number} tagContext - tag context
     * @param  {number} dataType - param type
     * @param  {number} paramValue - param value
     * @return {void}
     */
    public writeValue (
            tagContext: number, dataType: number, paramValue: number): void {
        const dataTypeSize: number = getTypeSize(dataType);

        // Context Number - Context tag - "Opening" Tag
        this.writeTag(tagContext, 1, 6);

        // DataType - Application tag - DataTypeSize
        this.writeTag(dataType, 0, dataTypeSize);

        // Write value by the "dataType"
        switch (dataType) {
            case BACNET_PROP_TYPES.real:
                this.writeFloatBE(paramValue)
                break;
            case BACNET_PROP_TYPES.unsignedInt:
            case BACNET_PROP_TYPES.enumerated:
            default:
                this.writeUInt8(paramValue);
                break;
        }

        // Context Number - Context tag - "Closing" Tag
        this.writeTag(tagContext, 1, 7);
    }
}
