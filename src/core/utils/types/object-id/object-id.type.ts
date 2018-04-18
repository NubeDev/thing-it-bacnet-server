import * as _ from 'lodash';

import { BACnetTypeBase } from '../type.base';

import {
    BACnetPropTypes,
} from '../../../enums';

import {
    IBACnetTag,
    IBACnetTypeObjectId,
} from '../../../interfaces';

import { ApiError } from '../../../errors';
import { BACnetReaderUtil } from '../../bacnet-reader.util';
import { BACnetWriterUtil } from '../../bacnet-writer.util';

export class BACnetObjectId extends BACnetTypeBase {
    public readonly className: string = 'BACnetObjectId';
    public readonly type: BACnetPropTypes = BACnetPropTypes.objectIdentifier;

    protected tag: IBACnetTag;
    protected data: IBACnetTypeObjectId;

    constructor (defValue?: IBACnetTypeObjectId) {
        super();
        this.data = defValue;
    }

    public readValue (reader: BACnetReaderUtil, changeOffset: boolean = true) {
        const tag = reader.readTag(changeOffset);
        this.tag = tag;

        const objId = reader.readUInt32BE(changeOffset);
        const objIdPayload = reader.decodeObjectIdentifier(objId);

        this.data = objIdPayload;
    }

    public writeValue (writer: BACnetWriterUtil) {
        writer.writeTag(BACnetPropTypes.objectIdentifier, 0, 4);

        // Write status flags
        writer.writeObjectIdentifier(this.data);
    }

    public setValue (newValue: IBACnetTypeObjectId): void {
        this.data = _.assign({}, this.data, newValue);
    }
    public getValue (): IBACnetTypeObjectId {
        return _.cloneDeep(this.data);
    }

    public set value (newValue: IBACnetTypeObjectId) {
        this.setValue(newValue);
    }
    public get value (): IBACnetTypeObjectId {
        return this.getValue();
    }
}
