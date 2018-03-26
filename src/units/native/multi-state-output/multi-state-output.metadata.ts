import {
    BACnetPropIds,
    BACnetObjTypes,
    BACnetPropTypes,
} from '../../../core/enums';

import {
    IBACnetObject,
} from '../../../core/interfaces';

export const MultiStateOutputMetadata: IBACnetObject = {
    type: BACnetObjTypes.MultiStateOutput,
    instance: 0,
    props: [
    ]
};
