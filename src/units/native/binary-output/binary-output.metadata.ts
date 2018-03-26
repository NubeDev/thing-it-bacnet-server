import {
    BACnetPropIds,
    BACnetObjTypes,
    BACnetPropTypes,
} from '../../../core/enums';

import {
    IBACnetObject,
} from '../../../core/interfaces';

export const BinaryOutputMetadata: IBACnetObject = {
    type: BACnetObjTypes.BinaryOutput,
    instance: 0,
    props: [
    ]
};
