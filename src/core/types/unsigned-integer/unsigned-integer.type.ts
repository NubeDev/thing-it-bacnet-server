import * as _ from 'lodash';

import { BACnetTypeBase } from '../type.base';

import {
    BACnetPropTypes,
} from '../../enums';

import {
    IBACnetTag,
} from '../../interfaces';

import { ApiError } from '../../errors';
import { BACnetReaderUtil, BACnetWriterUtil } from '../../utils';

export class BACnetUnsignedInteger extends BACnetTypeBase {
    public readonly className: string = 'BACnetUnsignedInteger';
    public readonly type: BACnetPropTypes = BACnetPropTypes.unsignedInt;

    protected tag: IBACnetTag;
    protected data: number;

    constructor (defValue?: number) {
        super();
        this.data = defValue;
    }

    public readValue (reader: BACnetReaderUtil, changeOffset: boolean = true) {
        const tag = reader.readTag(changeOffset);
        this.tag = tag;

        let value: number;
        switch (tag.value) {
            case 1:
                value = reader.readUInt8(changeOffset);
                break;
            case 2:
                value = reader.readUInt16BE(changeOffset);
                break;
            case 4:
                value = reader.readUInt32BE(changeOffset);
                break;
        }

        this.data = value;
    }

    public writeValue (writer: BACnetWriterUtil) {
        writer.writeParam(this.data, BACnetPropTypes.unsignedInt, 0);
    }

    public setValue (newValue: number): void {
        this.data = newValue;
    }

    public getValue (): number {
        return this.data;
    }

    public set value (newValue: number) {
        this.setValue(newValue);
    }
    public get value (): number {
        return this.getValue();
    }
}
