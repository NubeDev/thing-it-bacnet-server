import { BACnetLightUnitFunctions } from '../../../core/enums';
import { Units } from '../../../core/interfaces';

export const LevelFeedbackAliases: string[] = [
    BACnetLightUnitFunctions.LevelFeedback,
    '0',
    'level-feedback',
    'lvl-fb',
    'lvlFb',
];

export const LevelModificationAliases: string[] = [
    BACnetLightUnitFunctions.LevelModification,
    '1',
    'level-modification',
    'lvl-mod',
    'lvlMod'
];

export const StateFeedbackAliases: string[] = [
    BACnetLightUnitFunctions.StateFeedback,
    '2',
    'state-feedback',
    'state-fb',
    'stateFb',
];

export const StateModificationAliases: string[] = [
    BACnetLightUnitFunctions.StateModification,
    '3',
    'state-modification',
    'state-mod',
    'stateMod',
];

export const LightMetadata: Units.Light.Metadata[] = [
    {
        alias: LevelFeedbackAliases,
        config: { min: 0, max: 100 },
    },
    {
        alias: LevelModificationAliases,
        config: { min: 0, max: 100 },
    },
    {
        alias: StateFeedbackAliases,
        config: { stateText: [ 'ON', 'OFF' ] },
    },
    {
        alias: StateModificationAliases,
        config: { stateText: [ 'ON', 'OFF' ] },
    },
];
