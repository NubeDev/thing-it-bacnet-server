import * as _ from 'lodash';

import { BACnetTypeBase } from './type.base';

import {
    BACnetPropTypes,
} from '../../enums';

import {
    IBACnetTag,
    IBACnetTypeStatusFlags,
} from '../../interfaces';

import { ApiError } from '../../errors';
import { BACnetReaderUtil } from '../bacnet-reader.util';
import { BACnetWriterUtil } from '../bacnet-writer.util';
import { TyperUtil } from '../typer.util';

export class BACnetStatusFlags extends BACnetTypeBase {
    public readonly className: string = 'BACnetBitString';
    public readonly type: BACnetPropTypes = BACnetPropTypes.bitString;

    protected tag: IBACnetTag;
    private value: IBACnetTypeStatusFlags;

    constructor (defValue?: IBACnetTypeStatusFlags) {
        super();
        this.value = defValue;
    }

    public readValue (reader: BACnetReaderUtil, changeOffset: boolean = true) {
        const tag = reader.readTag(changeOffset);

        const unusedBits = reader.readUInt8(changeOffset);
        // Contains the status bits
        const value = reader.readUInt8(changeOffset);

        const inAlarm = !!TyperUtil.getBit(value, 7);
        const fault = !!TyperUtil.getBit(value, 6);
        const overridden = !!TyperUtil.getBit(value, 5);
        const outOfService = !!TyperUtil.getBit(value, 4);

        this.value = {
            inAlarm: inAlarm,
            fault: fault,
            overridden: overridden,
            outOfService: outOfService,
        };
    }

    public writeValue (writer: BACnetWriterUtil) {
        writer.writeTag(BACnetPropTypes.bitString, 0, 2);

        // Write unused bits
        writer.writeUInt8(0x04);

        let statusFlags = 0x00;
        statusFlags = TyperUtil.setBit(statusFlags, 7, this.value.inAlarm);
        statusFlags = TyperUtil.setBit(statusFlags, 6, this.value.fault);
        statusFlags = TyperUtil.setBit(statusFlags, 5, this.value.overridden);
        statusFlags = TyperUtil.setBit(statusFlags, 4, this.value.outOfService);

        // Write status flags
        writer.writeUInt8(statusFlags);
    }

    public setValue (newValue: any): void {
        this.value = _.assign({}, this.value, newValue);
    }

    public getValue (): IBACnetTypeStatusFlags {
        return _.cloneDeep(this.value);
    }
}
