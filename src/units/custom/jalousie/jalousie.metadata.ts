import { BACnetJalousieUnitFunctions } from '../../../core/enums';
import { Units } from '../../../core/interfaces';

export const PositionFeedbackAliases: string[] = [
    BACnetJalousieUnitFunctions.PositionFeedback,
    '0',
    'position-feedback',
    'pos-fb',
    'posFb',
];

export const PositionModificationAliases: string[] = [
    BACnetJalousieUnitFunctions.PositionModification,
    '1',
    'pos-modification',
    'pos-mod',
    'posMod'
];

export const RotationFeedbackAliases: string[] = [
    BACnetJalousieUnitFunctions.RotationFeedback,
    '2',
    'rotation-feedback',
    'rot-fb',
    'rotFb',
];

export const RotationModificationAliases: string[] = [
    BACnetJalousieUnitFunctions.RotationModification,
    '3',
    'rotation-modification',
    'rot-mod',
    'rotMod',
];

export const ActionAliases: string[] = [
    BACnetJalousieUnitFunctions.Action,
    '4',
    'act'
];

export const JalousieMetadata: Units.Jalousie.Metadata[] = [
    {
        alias: PositionFeedbackAliases,
        config: {},
    },
    {
        alias: PositionModificationAliases,
        config: { min: 0, max: 100, freq: 1000 },
    },
    {
        alias: RotationFeedbackAliases,
        config: {},
    },
    {
        alias: RotationModificationAliases,
        config: { min: 0, max: 90, freq: 30 },
    },
    {
        alias: ActionAliases,
        config: { stateText: [ 'MOVE', 'STOP' ] },
    },
];
