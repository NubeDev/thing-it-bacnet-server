import { BACnetUnitAbbr} from '../../../core/enums';

import { ICustomMetadata } from '../../../core/interfaces';

export const FunctionMetadata: ICustomMetadata[] = [
    {
        alias: [ BACnetUnitAbbr.Default, '0', 'unif', 'uniform', 'uniformDistribution' ],
        config: { min: 0, max: 1, freq: 1000 },
    },
    {
        alias: [ '1', 'gaus', 'gaussian' ],
        config: { min: 0, max: 1, freq: 1000 },
    },
];
