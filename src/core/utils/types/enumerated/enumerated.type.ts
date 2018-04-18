import * as _ from 'lodash';

import { BACnetTypeBase } from '../type.base';

import {
    BACnetPropTypes,
} from '../../../enums';

import {
    IBACnetTag,
} from '../../../interfaces';

import { ApiError } from '../../../errors';
import { BACnetReaderUtil } from '../../bacnet-reader.util';
import { BACnetWriterUtil } from '../../bacnet-writer.util';

export class BACnetEnumerated extends BACnetTypeBase {
    public readonly className: string = 'BACnetEnumerated';
    public readonly type: BACnetPropTypes = BACnetPropTypes.enumerated;

    protected tag: IBACnetTag;
    protected data: number;

    constructor (defValue?: number) {
        super();
        this.data = _.isNil(defValue) || !_.isFinite(+defValue)
            ? 0 : +defValue;
    }

    public readValue (reader: BACnetReaderUtil, changeOffset: boolean = true) {
        const tag = reader.readTag(changeOffset);
        this.tag = tag;

        const value: number = reader.readUInt8(changeOffset)
        this.data = value;
    }

    public writeValue (writer: BACnetWriterUtil) {
        writer.writeTag(BACnetPropTypes.enumerated, 0, 1);

        // Write status flags
        writer.writeUInt8(this.data);
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
