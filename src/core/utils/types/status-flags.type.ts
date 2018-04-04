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
import { TyperUtil } from '../typer.util';

export class BACnetStatusFlags extends BACnetTypeBase {
    public readonly className: string = 'BACnetBitString';
    public readonly type: BACnetPropTypes = BACnetPropTypes.bitString;

    protected tag: IBACnetTag;
    private statusFlags: any;

    public readValue (reader: BACnetReaderUtil, changeOffset: boolean = true) {
        const tag = reader.readTag(changeOffset);

        const unusedBits = reader.readUInt8(changeOffset);
        // Contains the status bits
        const value = reader.readUInt8(changeOffset);
        this.statusFlags.inAlarm = !!TyperUtil.getBit(value, 7);
        this.statusFlags.fault = !!TyperUtil.getBit(value, 6);
        this.statusFlags.overridden = !!TyperUtil.getBit(value, 5);
        this.statusFlags.outOfService = !!TyperUtil.getBit(value, 4);
    }

    public writeValue (writer: BACnetWriterUtil) {
        writer.writeTag(BACnetPropTypes.bitString, 0, 2);

        // Write unused bits
        writer.writeUInt8(0x04);

        let statusFlags = 0x00;
        statusFlags = TyperUtil.setBit(statusFlags, 7, this.statusFlags.inAlarm);
        statusFlags = TyperUtil.setBit(statusFlags, 6, this.statusFlags.fault);
        statusFlags = TyperUtil.setBit(statusFlags, 5, this.statusFlags.overridden);
        statusFlags = TyperUtil.setBit(statusFlags, 4, this.statusFlags.outOfService);

        // Write status flags
        writer.writeUInt8(statusFlags);
    }

    public setValue (newValue: any): void {
        this.statusFlags = _.assign({}, this.statusFlags, newValue);
    }

    public getValue (): number {
        return _.cloneDeep(this.statusFlags);
    }
}
