import * as _ from 'lodash';

import { ApiError } from '../errors';

import { BACNET_PROPERTY_KEYS } from '../enums';

export class BACnetReaderUtil {
    private buffer: Buffer;
    private offset: any;

    public readUInt8 (buffer: Buffer, offset: any) {
        return buffer.readUInt8(offset.inc());
    }

    public readUInt16BE (buffer: Buffer, offset: any) {
        return buffer.readUInt16BE(offset.inc(2));
    }

    public readUInt32BE (buffer: Buffer, offset: any) {
        return buffer.readUInt32BE(offset.inc(4));
    }

    public readObjectIdentifier (buffer: Buffer, offset: any): Map<string, any> {
        const objMap: Map<string, any> = new Map();

        const tag = this.readTag(buffer, offset);
        objMap.set('tag', tag);

        const objIdentifier = buffer.readUInt32BE(offset.inc(4));

        const objType = (objIdentifier >> 22) & 0x03FF;
        objMap.set('type', objType);

        const objInstance = (objIdentifier) & 0x03FFFFF;
        objMap.set('instance', objInstance);

        return objMap;
    }

    public readParam (buffer: Buffer, offset: any): Map<string, any> {
        const paramMap: Map<string, any> = new Map();

        const tag = this.readTag(buffer, offset);
        paramMap.set('tag', tag);

        let param;
        const len: number = tag.get('value');
        if (len === 1) {
            param = buffer.readUInt8(offset.up());
        } else if (len === 2) {
            param = buffer.readUInt16BE(offset.up(2));
        } else if (len === 4) {
            param = buffer.readUInt32BE(offset.up(4));
        }

        paramMap.set('value', param);

        return paramMap;
    }

    public readProperty (buffer: Buffer, offset: any): Map<string, any> {
        const propMap: Map<string, any> = this.readParam(buffer, offset);

        const propValue: number = propMap.get('value');
        const propName: string = BACNET_PROPERTY_KEYS[propValue];
        propMap.set('name', propName);

        return propMap;
    }

    public readListOfParams (buffer: Buffer, offset: any): Map<string, any> {
        const paramMap: Map<string, any> = new Map();

        const openTag = this.readTag(buffer, offset);

        const property = this.readProperty(buffer, offset);

        const closeTag = this.readTag(buffer, offset);

        return paramMap;
    }

    public readTag (buffer: Buffer, offset: any): Map<string, number> {
        const typeMap: Map<string, number> = new Map();

        const tag = buffer.readUInt8(offset.inc());

        const tagNumber = tag >> 4;
        typeMap.set('number', tagNumber);

        const tagClass = (tag >> 3) & 0x01;
        typeMap.set('class', tagClass);

        const tagValue = tag & 0x07;
        typeMap.set('value', tagValue);

        return typeMap;
    }
}
