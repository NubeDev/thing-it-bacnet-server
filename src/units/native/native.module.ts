import { NoopUnit } from './noop/noop.unit';
import { DeviceUnit } from './device/device.unit';

import { BinaryInputUnit } from './binary-input/binary-input.unit';
import { BinaryOutputUnit } from './binary-output/binary-output.unit';
import { BinaryValueUnit } from './binary-value/binary-value.unit';

import { AnalogInputUnit } from './analog-input/analog-input.unit';
import { AnalogOutputUnit } from './analog-output/analog-output.unit';
import { AnalogValueUnit } from './analog-value/analog-value.unit';

import { MultiStateInputUnit } from './multi-state-input/multi-state-input.unit';
import { MultiStateOutputUnit } from './multi-state-output/multi-state-output.unit';
import { MultiStateValueUnit } from './multi-state-value/multi-state-value.unit';

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
