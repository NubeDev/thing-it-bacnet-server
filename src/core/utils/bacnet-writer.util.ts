import * as _ from 'lodash';

import { ApiError } from '../errors';

import {
    IBACnetTypeBoolean,
    IBACnetTypeUnsignedInt,
    IBACnetTypeReal,
    IBACnetTypeBitString,
    IBACnetTypeCharString,
    IBACnetTypeEnumerated,
    IBACnetTypeStatusFlags,
    IBACnetTypeObjectId,
    IBACnetType,
} from '../interfaces';

import {
    BACnetPropIds,
    BACnetPropTypes,
    OpertionMaxValue,
    BACnetTagTypes,
} from '../enums';

import { OffsetUtil } from './offset.util';
import { TyperUtil } from './typer.util';

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
        const offsetValue = resultBuf.length;
        this.offset = new OffsetUtil(offsetValue);
    }

    /**
     * size - returns the size of internal buffer.
     *
     * @return {number}
     */
    get size (): number {
        return this.buffer.length;
    }

    /**
     * concat - concatenates the writers and returns the writer with common buffer.
     *
     * @static
     * @param  {BACnetWriterUtil[]} restsOfWriters - description
     * @return {type}
     */
    static concat (...restsOfWriters: BACnetWriterUtil[]) {
        const resultBuf = _.reduce(restsOfWriters, (result, writer) => {
            const bufOfWriter = writer.getBuffer();
            return Buffer.concat([result, bufOfWriter]);
        }, Buffer.alloc(0));
        return new BACnetWriterUtil(resultBuf);
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
    public writeObjectIdentifier (objId: IBACnetTypeObjectId): void {
        // Object Identifier = Object Type 10 bits, Object ID 22 bits
        const objectIdentifier = ((objId.type & 0x03FF) << 22)
            | (objId.instance & 0x03FFFFF);
        this.writeUInt32BE(objectIdentifier);
    }

    /**
     * writeParam - writes BACnet param to the internal buffer.
     *
     * @param  {number} paramValue - param value
     * @param  {number} tagNumber - tag number
     * @param  {BACnetTagTypes} [tagType=BACnetTagTypes.context] - tag type
     * @return {void}
     */
    public writeParam (
            paramValue: number, tagNumber: number,
            tagType: BACnetTagTypes = BACnetTagTypes.context): void {
        const uIntSize = this.getUIntSize(paramValue);
        // Tag Number - Tag Type - Param Length (bytes)
        this.writeTag(tagNumber, tagType, uIntSize);
        // Write unsigned integer value
        this.writeUIntValue(paramValue);
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
     * writeValue - writes BACnet property value to the internal buffer.
     *
     * @param  {number} tagNumber - tag number
     * @param  {BACnetPropTypes} valueType - type of property value
     * @param  {IBACnetType} value - parama object with value
     * @return {void}
     */
    public writeValue (tagNumber: number, propValueType: BACnetPropTypes, value: IBACnetType): void {
        // Context Number - Context tag - "Opening" Tag
        this.writeTag(tagNumber, 1, 6);

        switch (propValueType) {
            case BACnetPropTypes.boolean:
                this.writeTypeBoolean(value as IBACnetTypeBoolean);
                break;
            case BACnetPropTypes.unsignedInt:
                this.writeTypeUnsignedInt(value as IBACnetTypeUnsignedInt);
                break;
            case BACnetPropTypes.real:
                this.writeTypeReal(value as IBACnetTypeReal);
                break;
            case BACnetPropTypes.characterString:
                this.writeTypeCharString(value as IBACnetTypeCharString);
                break;
            case BACnetPropTypes.bitString:
                this.writeTypeStatusFlags(value as IBACnetTypeStatusFlags);
                break;
            case BACnetPropTypes.enumerated:
                this.writeTypeEnumerated(value as IBACnetTypeEnumerated);
                break;
            case BACnetPropTypes.objectIdentifier:
                this.writeTypeObjectIdentifier(value as IBACnetTypeObjectId);
                break;
        }

        // Context Number - Context tag - "Closing" Tag
        this.writeTag(tagNumber, 1, 7);
    }

    /**
     * writeTypeBoolean - writes BACnet Boolean value to the internal buffer.
     *
     * @param  {any} params - object with parameters
     * @return {void}
     */
    public writeTypeBoolean (params: IBACnetTypeBoolean): void {
        // DataType - Application tag - DataTypeSize
        this.writeTag(BACnetPropTypes.boolean, 0, +params.value);
    }

    /**
     * writeTypeUnsignedInt - writes BACnet Integer value to the internal buffer.
     *
     * @param  {IBACnetTypeUnsignedInt} params - object with parameters
     * @return {void}
     */
    public writeTypeUnsignedInt (param: IBACnetTypeUnsignedInt): void {
        this.writeParam(param.value, BACnetPropTypes.unsignedInt, 0);
    }

    /**
     * writeUIntValue - writes unsigned integer value to the internal buffer.
     *
     * @param  {number} uIntValue - unsigned int value
     * @return {void}
     */
    public writeUIntValue (uIntValue: number): void {
        // DataType - Application tag - DataTypeSize
        if (uIntValue <= OpertionMaxValue.uInt8) {
            this.writeUInt8(uIntValue);
        } else if (uIntValue <= OpertionMaxValue.uInt16) {
            this.writeUInt16BE(uIntValue);
        } else if (uIntValue <= OpertionMaxValue.uInt32) {
            this.writeUInt32BE(uIntValue);
        }
    }

    /**
     * getUIntSize - returns the size (byte) of the unsigned int value.
     *
     * @param  {number} uIntValue - unsigned int value
     * @return {number}
     */
    public getUIntSize (uIntValue: number): number {
        if (uIntValue <= OpertionMaxValue.uInt8) {
            return 1;
        } else if (uIntValue <= OpertionMaxValue.uInt16) {
            return 2;
        } else if (uIntValue <= OpertionMaxValue.uInt32) {
            return 4;
        }
    }

    /**
     * writeTypeReal - writes BACnet Real value to the internal buffer.
     *
     * @param  {any} params - object with parameters
     * @return {void}
     */
    public writeTypeReal (params: IBACnetTypeReal): void {
        // DataType - Application tag - DataTypeSize
        this.writeTag(BACnetPropTypes.real, 0, 4);

        this.writeFloatBE(params.value)
    }

    /**
     * writeTypeStatusFlags - writes BACnet Status Flags value to the internal buffer.
     *
     * @param  {any} params - object with parameters
     * @return {void}
     */
    public writeTypeCharString (params: IBACnetTypeCharString): void {
        // DataType - Application tag - Extended value (5)
        this.writeTag(BACnetPropTypes.characterString, 0, 5);

        // Write lenght
        const paramValueLen = params.value.length + 1;
        this.writeUInt8(paramValueLen);

        // Write "ansi" / "utf8" encoding
        this.writeUInt8(0x00);

        // Write string
        this.writeString(params.value);
    }

    /**
     * writeTypeStatusFlags - writes BACnet Status Flags value to the internal buffer.
     *
     * @param  {any} params - object with parameters
     * @return {void}
     */
    public writeTypeStatusFlags (params: IBACnetTypeStatusFlags): void {
        // DataType - Application tag - 2 bytes
        this.writeTag(BACnetPropTypes.bitString, 0, 2);

        // Write unused bits
        this.writeUInt8(0x04);

        let statusFlags = 0x00;
        statusFlags = TyperUtil.setBit(statusFlags, 7, params.inAlarm);
        statusFlags = TyperUtil.setBit(statusFlags, 6, params.fault);
        statusFlags = TyperUtil.setBit(statusFlags, 5, params.overridden);
        statusFlags = TyperUtil.setBit(statusFlags, 4, params.outOfService);

        // Write status flags
        this.writeUInt8(statusFlags);
    }

    /**
     * writeTypeEnumerated - writes BACnet Enumerated value to the internal buffer.
     *
     * @param  {any} params - object with parameters
     * @return {void}
     */
    public writeTypeEnumerated (params: IBACnetTypeEnumerated): void {
        // DataType - Application tag - 1 bytes
        this.writeTag(BACnetPropTypes.enumerated, 0, 1);

        // Write status flags
        this.writeUInt8(params.value);
    }

    /**
     * writeTypeObjectIdentifier - writes BACnet ObjectIdentifier value to the
     * internal buffer.
     *
     * @param  {any} params - object with parameters
     * @return {void}
     */
    public writeTypeObjectIdentifier (params: IBACnetTypeObjectId): void {
        // DataType - Application tag - 4 bytes
        this.writeTag(BACnetPropTypes.objectIdentifier, 0, 4);

        // Write status flags
        this.writeObjectIdentifier(params);
    }
}
