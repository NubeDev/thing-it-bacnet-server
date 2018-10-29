import { BACnetUnitAbbr} from '../../../core/enums';

import { Units } from '../../../core/interfaces';

export const FunctionalMetadata: Units.Functional.Metadata[] = [
    {
        alias: [ BACnetUnitAbbr.Default, '0', 'unif', 'uniform', 'uniformDistribution' ],
        config: { min: 0, max: 1, freq: 1000 },
    },
    {
        alias: [ '1', 'gaus', 'gaussian', 'norm', 'normal', 'normalDistribution' ],
        config: { min: 0, max: 1, freq: 1000 },
    },
];
