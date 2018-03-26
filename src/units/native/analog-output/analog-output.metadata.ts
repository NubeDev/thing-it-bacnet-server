import {
    BACnetPropIds,
    BACnetObjTypes,
    BACnetPropTypes,
} from '../../../core/enums';

import {
    IBACnetObject,
} from '../../../core/interfaces';

export const AnalogOutputMetadata: IBACnetObject = {
    type: BACnetObjTypes.AnalogOutput,
    instance: 0,
    props: [
    ]
};
