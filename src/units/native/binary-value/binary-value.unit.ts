import * as _ from 'lodash';

import {
    BACnetPropIds,
} from '../../../core/enums';

import {
    ApiError,
} from '../../../core/errors';

import {
    IBACnetObject,
} from '../../../core/interfaces';

import { BinaryValueMetadata } from './binary-value.metadata';

import { UnitNativeBase } from '../../../core/bases/unit-native.base';

export class BinaryValueUnit extends UnitNativeBase {
    public metadata: IBACnetObject;

    constructor (bnUnit: any) {
        super();
        this.metadata = _.cloneDeep(BinaryValueMetadata);

        if (_.isNil(bnUnit.id)) {
            throw new ApiError('BinaryValueUnit - constructor: Unit ID is required!');
        }
        this.metadata.id = bnUnit.id;

        this.setProps(bnUnit.config);
    }
}
