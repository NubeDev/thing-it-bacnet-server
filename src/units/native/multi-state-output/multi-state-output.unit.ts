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

import { MultiStateOutputMetadata } from './multi-state-output.metadata';

import { NativeUnit } from '../native.unit';

export class MultiStateOutputUnit extends NativeUnit {
    public readonly className: string = 'MultiStateOutputUnit';

    constructor (edeUnit: IEDEUnit) {
        super(edeUnit, MultiStateOutputMetadata);
    }

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);
    }
}
