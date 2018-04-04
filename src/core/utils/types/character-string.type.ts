import * as _ from 'lodash';

import { BACnetTypeBase } from './type.base';

import {
    BACnetPropTypes,
} from '../../enums';

import {
    IBACnetTag,
} from '../../interfaces';

import { ApiError } from '../../errors';
import { BACnetReaderUtil } from '../bacnet-reader.util';
import { BACnetWriterUtil } from '../bacnet-writer.util';

export class BACnetCharacterString extends BACnetTypeBase {
    public readonly className: string = 'BACnetCharacterString';
    public readonly type: BACnetPropTypes = BACnetPropTypes.characterString;

    protected tag: IBACnetTag;
    private encoding: string;
    private value: string;

    constructor (defValue?: string) {
        super();
        this.value = defValue;
    }

    public readValue (reader: BACnetReaderUtil, changeOffset: boolean = true) {
        const tag = reader.readTag(changeOffset);

        const strLen = reader.readUInt8(changeOffset);
        const charSet = reader.readUInt8(changeOffset);

        // Get the character encoding
        const charEncode = this.getStringEncode(charSet);
        this.encoding = charEncode;

        const value = reader.readString(charEncode, strLen - 1, changeOffset);
        this.value = value;
    }

    public writeValue (writer: BACnetWriterUtil) {
        // DataType - Application tag - Extended value (5)
        writer.writeTag(BACnetPropTypes.characterString, 0, 5);

        // Write lenght
        const paramValueLen = this.value.length + 1;
        writer.writeUInt8(paramValueLen);

        // Write "ansi" / "utf8" encoding
        writer.writeUInt8(0x00);

        // Write string
        writer.writeString(this.value);
    }

    public setValue (newValue: string) {
        this.value = newValue;
    }

    public getValue (): string {
        return this.value;
    }

    /**
     * HELPERs
     */

    private getStringEncode (charSet: number): string {
        switch (charSet) {
            case 0:
            default:
                return 'utf8';
        }
    }
}
