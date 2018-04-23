import * as _ from 'lodash';

import { BACnetTypeBase } from '../type.base';

import {
    BACnetPropTypes,
} from '../../enums';

import {
    IBACnetTag,
} from '../../interfaces';

import { BACnetError } from '../../errors';

import { BACnetReaderUtil, BACnetWriterUtil } from '../../utils';

export class BACnetNull extends BACnetTypeBase {
    public readonly className: string = 'BACnetNull';
    public readonly type: BACnetPropTypes = BACnetPropTypes.nullData;

    protected tag: IBACnetTag;

    constructor () {
        super();
    }

    public readValue (reader: BACnetReaderUtil, changeOffset: boolean = true) {
        const tag = reader.readTag(changeOffset);
        this.tag = tag;
    }

    public writeValue (writer: BACnetWriterUtil) {
        writer.writeTag(BACnetPropTypes.nullData, 0, 0);
    }

    public setValue (newValue: null): void {
    }
    public getValue (): null {
        return null;
    }

    public set value (newValue: null) {
        this.setValue(newValue);
    }
    public get value (): null {
        return this.getValue();
    }
}
