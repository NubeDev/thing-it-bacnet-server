import {
    BACnetPropIds,
    BACnetObjTypes,
    BACnetPropTypes,
} from '../../../core/enums';

import {
    IBACnetObject,
} from '../../../core/interfaces';

export const MultiStateValueMetadata: IBACnetObject = {
    type: BACnetObjTypes.MultiStateValue,
    instance: 0,
    props: [
    ]
};
