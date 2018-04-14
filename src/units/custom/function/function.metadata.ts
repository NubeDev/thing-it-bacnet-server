
import { ICustomMetadata } from '../../../core/interfaces';

export const FunctionMetadata: ICustomMetadata[] = [
    {
        alias: [ '', '0', 'rand', 'random' ],
        config: { min: 0, max: 1, freq: 1000 },
    },
    {
        alias: [ '1', 'unif', 'uniform', 'uniformDistribution' ],
        config: { min: 0, max: 1, freq: 1000 },
    },
    {
        alias: [ '2', 'gaus', 'gaussian' ],
        config: { min: 0, max: 1, freq: 1000 },
    },
];
