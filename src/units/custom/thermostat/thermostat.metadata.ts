
import { IThermostatMetadata } from '../../../core/interfaces';

export const ThermostatMetadata: IThermostatMetadata[] = [
    {
        alias: [ 'setpoint', 'set' ],
        config: { min: 18, max: 26 },
    },
    {
        alias: [ 'temperature', 'temp' ],
        config: { min: 0, max: 40, freq: 1000 },
    },
    {
        alias: [ 'mode' ],
        config: { stateText: [ 'HEAT', 'COOL'] },
    }
];
