import { BACnetThermostatUnitFunctions } from '../../../core/enums';
import { IThermostatMetadata } from '../../../core/interfaces';

export const SetpointFeedbackAliases: string[] = [
    BACnetThermostatUnitFunctions.SetpointFeedback,
    '0',
    'setpoint-feedback',
    'setpointFb',
    'setpoint-fb',
    'feedback',
    'fb'
];

export const SetpointModificationAliases: string[] = [
    BACnetThermostatUnitFunctions.SetpointModification,
    '1',
    'setpoint-modification',
    'setpointMod',
    'setpoint-mod',
    'modification',
    'modif'
];

export const TemperatureAliases: string[] = [
    BACnetThermostatUnitFunctions.Temperature,
    '2',
    'temp'
];

export const ModeAliases: string[] = [
    BACnetThermostatUnitFunctions.Mode,
    '3'
];

export const ThermostatMetadata: IThermostatMetadata[] = [
    {
        alias: SetpointFeedbackAliases,
        config: { min: 18, max: 26 },
    },
    {
        alias: SetpointModificationAliases,
        config: { min: -4, max: 4 },
    },
    {
        alias: TemperatureAliases,
        config: { min: 0, max: 40, freq: 1000 },
    },
    {
        alias: ModeAliases,
        config: { stateText: [ 'COOL', 'HEAT' ] },
    }
];
