import { BACnetUnitAbbr} from '../../../core/enums';

import { Units } from '../../../core/interfaces';

export const NoopMetadata: Units.Functional.Metadata[] = [
    {
        alias: [ BACnetUnitAbbr.Default, 'noop' ],
        config: { min: 0, max: 1, freq: 1000 },
    },
];
