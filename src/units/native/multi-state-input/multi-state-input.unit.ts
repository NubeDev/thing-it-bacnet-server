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

import { MultiStateInputMetadata } from './multi-state-input.metadata';

import { NativeUnit } from '../native.unit';

export class MultiStateInputUnit extends NativeUnit {
    public readonly className: string = 'MultiStateInputUnit';

    constructor (edeUnit: IEDEUnit) {
        super(edeUnit, MultiStateInputMetadata);
    }

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);
    }
}
