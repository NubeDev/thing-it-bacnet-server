import { AliasMap } from '../../core/alias';
import { BACnetUnitAbbr } from '../../core/bacnet/enums';

import { NoopUnit } from './noop/noop.unit';
import { DeviceUnit } from './device/device.unit';

import { BinaryInputUnit } from './binary/binary-input/binary-input.unit';
import { BinaryOutputUnit } from './binary/binary-output/binary-output.unit';
import { BinaryValueUnit } from './binary/binary-value/binary-value.unit';

import { AnalogInputUnit } from './analog/analog-input/analog-input.unit';
import { AnalogOutputUnit } from './analog/analog-output/analog-output.unit';
import { AnalogValueUnit } from './analog/analog-value/analog-value.unit';

import { MultiStateInputUnit } from './multi-state/multi-state-input/multi-state-input.unit';
import { MultiStateOutputUnit } from './multi-state/multi-state-output/multi-state-output.unit';
import { MultiStateValueUnit } from './multi-state/multi-state-value/multi-state-value.unit';

export const NativeModule: AliasMap<any> = new AliasMap<any>([
    { alias: [ BACnetUnitAbbr.Default, 'Noop' ], value: NoopUnit },
    { alias: 'Device', value: DeviceUnit },

    { alias: 'BinaryInput', value: BinaryInputUnit },
    { alias: 'BinaryOutput', value: BinaryOutputUnit },
    { alias: 'BinaryValue', value: BinaryValueUnit },

    { alias: 'AnalogInput', value: AnalogInputUnit },
    { alias: 'AnalogOutput', value: AnalogOutputUnit },
    { alias: 'AnalogValue', value: AnalogValueUnit },

    { alias: 'MultiStateInput', value: MultiStateInputUnit },
    { alias: 'MultiStateOutput', value: MultiStateOutputUnit },
    { alias: 'MultiStateValue', value: MultiStateValueUnit },
]);
