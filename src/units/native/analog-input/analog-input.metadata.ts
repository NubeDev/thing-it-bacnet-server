import {
    BACnetPropIds,
    BACnetObjTypes,
    BACnetPropTypes,
} from '../../../core/enums';

import {
    IBACnetObject,
} from '../../../core/interfaces';

export const AnalogInputMetadata: IBACnetObject = {
    type: BACnetObjTypes.AnalogInput,
    instance: 0,
    props: [
    ]
};
