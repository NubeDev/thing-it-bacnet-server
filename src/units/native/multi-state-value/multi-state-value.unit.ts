import * as _ from 'lodash';

import {
    BACnetPropIds,
} from '../../../core/enums';

import {
    ApiError,
} from '../../../core/errors';

import {
    IBACnetObjectProperty,
    IEDEUnit,
} from '../../../core/interfaces';

import { MultiStateValueMetadata } from './multi-state-value.metadata';

import { NativeUnit } from '../native.unit';

export class MultiStateValueUnit extends NativeUnit {
    public readonly className: string = 'MultiStateValueUnit';

    constructor () {
        super();
        this.storage.addUnitStorage(MultiStateValueMetadata);
    }

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);
    }
}
