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

export const NativeModule: Map<string, any> = new Map<string, any>([
    [ 'Noop', NoopUnit ],
    [ 'Device', DeviceUnit ],

    [ 'BinaryInput', BinaryInputUnit ],
    [ 'BinaryOutput', BinaryOutputUnit ],
    [ 'BinaryValue', BinaryValueUnit ],

    [ 'AnalogInput', AnalogInputUnit ],
    [ 'AnalogOutput', AnalogOutputUnit ],
    [ 'AnalogValue', AnalogValueUnit ],

    [ 'MultiStateInput', MultiStateInputUnit ],
    [ 'MultiStateOutput', MultiStateOutputUnit ],
    [ 'MultiStateValue', MultiStateValueUnit ],
]);
