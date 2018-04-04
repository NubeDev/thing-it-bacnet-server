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

export class BACnetReal extends BACnetTypeBase {
    public readonly className: string = 'BACnetReal';
    public readonly type: BACnetPropTypes = BACnetPropTypes.real;

    protected tag: IBACnetTag;
    private value: number;

    constructor (defValue?: number) {
        super();
        this.value = defValue;
    }

    public readValue (reader: BACnetReaderUtil, changeOffset: boolean = true) {
        const tag = reader.readTag(changeOffset);

        let value: number = reader.readFloatBE(changeOffset);

        this.value = value;
    }

    public writeValue (writer: BACnetWriterUtil) {
        writer.writeTag(BACnetPropTypes.real, 0, 4);

        writer.writeFloatBE(this.value)
    }

    public setValue (newValue: number) {
        this.value = newValue;
    }

    public getValue () {
        return this.value;
    }
}
