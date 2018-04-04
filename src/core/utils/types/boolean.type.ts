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

export class BACnetBoolean extends BACnetTypeBase {
    public readonly className: string = 'BACnetBoolean';
    public readonly type: BACnetPropTypes = BACnetPropTypes.boolean;

    protected tag: IBACnetTag;
    private value: boolean;

    public readValue (reader: BACnetReaderUtil, changeOffset: boolean = true) {
        const tag = reader.readTag(changeOffset);

        this.value = !!tag.value;
    }

    public writeValue (writer: BACnetWriterUtil) {
        writer.writeTag(BACnetPropTypes.boolean, 0, +this.value);
    }

    public setValue (newValue: boolean): void {
        this.value = newValue;
    }

    public getValue (): boolean {
        return this.value;
    }
}
