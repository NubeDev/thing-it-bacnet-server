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

export class BACnetBoolean extends BACnetTypeBase {
    public readonly className: string = 'BACnetBoolean';
    public readonly type: BACnetPropTypes = BACnetPropTypes.boolean;

    protected tag: IBACnetTag;
    protected data: boolean;

    constructor (defValue?: boolean) {
        super();

        this.data = _.isNil(defValue)
            ? false : !!defValue;
    }

    public readValue (reader: BACnetReaderUtil, changeOffset: boolean = true) {
        const tag = reader.readTag(changeOffset);
        this.tag = tag;

        this.data = !!tag.value;
    }

    public writeValue (writer: BACnetWriterUtil) {
        writer.writeTag(BACnetPropTypes.boolean, 0, +this.data);
    }

    public setValue (newValue: boolean): void {
        this.data = newValue;
    }
    public getValue (): boolean {
        return this.data;
    }

    public set value (newValue: boolean) {
        this.setValue(newValue);
    }
    public get value (): boolean {
        return this.getValue();
    }
}
