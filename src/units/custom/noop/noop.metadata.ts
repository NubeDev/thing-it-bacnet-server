import { BACnetUnitAbbr} from '../../../core/enums';

import { ICustomMetadata } from '../../../core/interfaces';

export const NoopMetadata: ICustomMetadata[] = [
    {
        alias: [ BACnetUnitAbbr.Default, 'noop' ],
        config: { min: 0, max: 1, freq: 1000 },
    },
];
