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

export class BACnetEnumerated extends BACnetTypeBase {
    public readonly className: string = 'BACnetEnumerated';
    public readonly type: BACnetPropTypes = BACnetPropTypes.enumerated;

    protected tag: IBACnetTag;
    private value: number;

    public readValue (reader: BACnetReaderUtil, changeOffset: boolean = true) {
        const tag = reader.readTag(changeOffset);

        const value: number = reader.readUInt8(changeOffset)

        this.value = value;
    }

    public writeValue (writer: BACnetWriterUtil) {
        writer.writeTag(BACnetPropTypes.enumerated, 0, 1);

        // Write status flags
        writer.writeUInt8(this.value);
    }

    public setValue (newValue: number): void {
        this.value = newValue;
    }

    public getValue (): number {
        return this.value;
    }
}
