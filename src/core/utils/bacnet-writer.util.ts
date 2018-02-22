import * as _ from 'lodash';

import { ApiError } from '../errors';

import {
    BACNET_PROPERTY_KEYS,
    BACNET_PROP_TYPES,
} from '../enums';

import { OffsetUtil, TyperUtil } from '../utils';

export class BACnetWriterUtil {
    public offset: OffsetUtil;
    private buffer: Buffer;

    constructor (resultBuf?: Buffer) {
        this.offset = new OffsetUtil(0);

        if (!resultBuf) {
            this.buffer = Buffer.alloc(0);
            return;
        }
        this.buffer = resultBuf;
    }

    public getBuffer () {
        return this.buffer;
    }

    /**
     * increasBufferSize - increases the size of the internal buffer.
     *
     * @param  {number} len - new size
     * @return {void}
     */
    private increasBufferSize (size: number): void {
        const newBuffer = Buffer.alloc(size);
        this.buffer = Buffer.concat([this.buffer, newBuffer]);
    }

    /**
     * writeUInt8 - writes 1 byte to the internal buffer.
     *
     * @param  {number} value - data
     * @return {void}
     */
    public writeUInt8 (value: number): void {
        this.increasBufferSize(1);
        this.buffer.writeUInt8(value, this.offset.inc());
    }

    /**
     * writeUInt16BE - writes 2 bytes to the internal buffer.
     *
     * @param  {number} value - data
     * @return {void}
     */
    public writeUInt16BE (value: number): void {
        this.increasBufferSize(2);
        this.buffer.writeUInt16BE(value, this.offset.inc(2));
    }

    /**
     * writeUInt32BE - writes 4 bytes (integer) to the internal buffer.
     *
     * @param  {number} value - data
     * @return {void}
     */
    public writeUInt32BE (value: number): void {
        this.increasBufferSize(4);
        this.buffer.writeUInt32BE(value, this.offset.inc(4));
    }

    /**
     * writeFloatBE - writes 4 bytes (real) to the internal buffer.
     *
     * @param  {number} value - data
     * @return {void}
     */
    public writeFloatBE (value: number): void {
        this.increasBufferSize(4);
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
        this.increasBufferSize(strLen);
        this.buffer.write(str, offStart, strLen, encoding);
    }

    /**
     * writeTag - writes BACnet tag to the internal buffer.
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
     * writeObjectIdentifier - writes BACnet object identifier to the internal buffer.
     *
     * @param  {number} objectType - object type
     * @param  {number} objectId - object id
     * @return {void}
     */
    public writeObjectIdentifier (objectType: number, objectId: number): void {
        // Object Identifier = Object Type 10 bits, Object ID 22 bits
        const objectIdentifier = ((objectType & 0x03FF) << 22)
            | (objectId & 0x03FFFFF);
        this.writeUInt32BE(objectIdentifier);
    }

    /**
     * writeParam - writes BACnet param name to the internal buffer.
     *
     * @param  {number} paramName - param name
     * @param  {number} tagContext - tag context
     * @param  {number} paramSize - param size
     * @return {void}
     */
    public writeParam (
            paramName: number, tagContext: number, paramSize: number = 1): void {
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
     * writeProperty - writes BACnet param name to the internal buffer.
     *
     * @param  {number} paramName - param name
     * @param  {number} tagContext - tag context
     * @return {void}
     */
    public writeProperty (propName: number, tagContext: number): void {
        // Context Number - Context tag - Param Length (bytes)
        this.writeTag(tagContext, 1, 1);

        // Write property
        this.writeUInt8(propName);
    }

    /**
     * writeTypeBoolean - writes BACnet Boolean value to the internal buffer.
     *
     * @param  {number} tagContext - tag context
     * @param  {boolean} paramValue - boolean value
     * @return {void}
     */
    public writeTypeBoolean (tagContext: number, paramValue: boolean): void {
        // Context Number - Context tag - "Opening" Tag
        this.writeTag(tagContext, 1, 6);

        // DataType - Application tag - DataTypeSize
        this.writeTag(BACNET_PROP_TYPES.boolean, 0, +paramValue);

        // Context Number - Context tag - "Closing" Tag
        this.writeTag(tagContext, 1, 7);
    }

    /**
     * writeTypeUnsignedInt - writes BACnet Integer value to the internal buffer.
     *
     * @param  {number} tagContext - tag context
     * @param  {number} paramValue - int number
     * @return {void}
     */
    public writeTypeUnsignedInt (tagContext: number, paramValue: number): void {
        // Context Number - Context tag - "Opening" Tag
        this.writeTag(tagContext, 1, 6);

        // DataType - Application tag - DataTypeSize
        this.writeTag(BACNET_PROP_TYPES.unsignedInt, 0, 1);

        this.writeUInt8(paramValue)

        // Context Number - Context tag - "Closing" Tag
        this.writeTag(tagContext, 1, 7);
    }

    /**
     * writeTypeReal - writes BACnet Real value to the internal buffer.
     *
     * @param  {number} tagContext - tag context
     * @param  {number} paramValue - real number
     * @return {void}
     */
    public writeTypeReal (tagContext: number, paramValue: number): void {
        // Context Number - Context tag - "Opening" Tag
        this.writeTag(tagContext, 1, 6);

        // DataType - Application tag - DataTypeSize
        this.writeTag(BACNET_PROP_TYPES.real, 0, 4);

        this.writeFloatBE(paramValue)

        // Context Number - Context tag - "Closing" Tag
        this.writeTag(tagContext, 1, 7);
    }

    /**
     * writeTypeStatusFlags - writes BACnet Status Flags value to the internal buffer.
     *
     * @param  {number} tagContext - tag context
     * @param  {number} paramValue - enumerated value
     * @return {void}
     */
    public writeTypeCharString (tagContext: number, paramValue: string): void {
        // Context Number - Context tag - "Opening" Tag
        this.writeTag(tagContext, 1, 6);

        // DataType - Application tag - Extended value (5)
        this.writeTag(BACNET_PROP_TYPES.characterString, 0, 5);

        // Write lenght
        const paramValueLen = paramValue.length;
        this.writeUInt8(paramValueLen);

        // Write "ansi" / "utf8" encoding
        this.writeUInt8(0x00);

        // Write string
        this.writeString(paramValue);

        // Context Number - Context tag - "Closing" Tag
        this.writeTag(tagContext, 1, 7);
    }

    /**
     * writeTypeStatusFlags - writes BACnet Status Flags value to the internal buffer.
     *
     * @param  {number} tagContext - tag context
     * @param  {boolean} inAlarm - in alarm flag
     * @param  {boolean} fault - fault flag
     * @param  {boolean} overridden - overridden flag
     * @param  {boolean} outOfService - out of service flag
     * @return {void}
     */
    public writeTypeStatusFlags (tagContext: number, inAlarm: boolean,
        fault: boolean, overridden: boolean, outOfService: boolean): void {
        // Context Number - Context tag - "Opening" Tag
        this.writeTag(tagContext, 1, 6);

        // DataType - Application tag - 2 bytes
        this.writeTag(BACNET_PROP_TYPES.bitString, 0, 2);

        // Write unused bits
        this.writeUInt8(0x0F);

        let statusFlags = 0x00;
        statusFlags = TyperUtil.setBit(statusFlags, 7, inAlarm);
        statusFlags = TyperUtil.setBit(statusFlags, 6, fault);
        statusFlags = TyperUtil.setBit(statusFlags, 5, overridden);
        statusFlags = TyperUtil.setBit(statusFlags, 4, outOfService);

        // Write status flags
        this.writeUInt8(statusFlags);

        // Context Number - Context tag - "Closing" Tag
        this.writeTag(tagContext, 1, 7);
    }

    /**
     * writeTypeEnumerated - writes BACnet Enumerated value to the internal buffer.
     *
     * @param  {number} tagContext - tag context
     * @param  {number} paramValue - enumerated value
     * @return {void}
     */
    public writeTypeEnumerated (tagContext: number, paramValue: number): void {
        // Context Number - Context tag - "Opening" Tag
        this.writeTag(tagContext, 1, 6);

        // DataType - Application tag - 1 bytes
        this.writeTag(BACNET_PROP_TYPES.enumerated, 0, 1);

        // Write status flags
        this.writeUInt8(paramValue);

        // Context Number - Context tag - "Closing" Tag
        this.writeTag(tagContext, 1, 7);
    }

    /**
     * writeTypeObjectIdentifier - writes BACnet ObjectIdentifier value to the
     * internal buffer.
     *
     * @param  {number} tagContext - tag context
     * @param  {number} objectType - object type
     * @param  {number} objectInstance - object instance
     * @return {void}
     */
    public writeTypeObjectIdentifier (tagContext: number,
            objectType: number, objectInstance: number): void {
        // Context Number - Context tag - "Opening" Tag
        this.writeTag(tagContext, 1, 6);

        // DataType - Application tag - 4 bytes
        this.writeTag(BACNET_PROP_TYPES.objectIdentifier, 0, 4);

        // Write status flags
        this.writeObjectIdentifier(objectType, objectInstance);

        // Context Number - Context tag - "Closing" Tag
        this.writeTag(tagContext, 1, 7);
    }
}
