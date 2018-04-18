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

export class BACnetReal extends BACnetTypeBase {
    public readonly className: string = 'BACnetReal';
    public readonly type: BACnetPropTypes = BACnetPropTypes.real;

    protected tag: IBACnetTag;
    protected data: number;

    constructor (defValue?: number) {
        super();
        this.data = _.isNil(defValue) || !_.isFinite(+defValue)
            ? 0 : this.toFixed(+defValue);
    }

    public readValue (reader: BACnetReaderUtil, changeOffset: boolean = true) {
        const tag = reader.readTag(changeOffset);
        this.tag = tag;

        let value: number = reader.readFloatBE(changeOffset);
        this.data = this.toFixed(value);
    }

    public writeValue (writer: BACnetWriterUtil) {
        writer.writeTag(BACnetPropTypes.real, 0, 4);

        writer.writeFloatBE(this.data)
    }

    public setValue (newValue: number) {
        this.data = newValue;
    }
    public getValue () {
        return this.data;
    }

    public set value (newValue: number) {
        this.setValue(newValue);
    }
    public get value (): number {
        return this.getValue();
    }

    /**
     * HELPERs
     */

    private toFixed (value: number): number {
        return +value.toFixed(4);
    }
}
