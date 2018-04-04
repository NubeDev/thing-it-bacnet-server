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

export class BACnetNull extends BACnetTypeBase {
    public readonly className: string = 'BACnetNull';
    public readonly type: BACnetPropTypes = BACnetPropTypes.nullData;

    protected tag: IBACnetTag;

    constructor () {
        super();
    }

    public readValue (reader: BACnetReaderUtil, changeOffset: boolean = true) {
        const tag = reader.readTag(changeOffset);
    }

    public writeValue (writer: BACnetWriterUtil) {
        writer.writeTag(BACnetPropTypes.nullData, 0, 0);
    }

    public setValue (newValue: boolean): void {
    }

    public getValue (): boolean {
        return null;
    }
}
