import * as _ from 'lodash';

import {
    BACnetPropIds,
} from '../../../core/enums';

import {
    ApiError,
} from '../../../core/errors';

import {
    IBACnetObject,
    IEDEUnit,
} from '../../../core/interfaces';

import { MultiStateInputMetadata } from './multi-state-input.metadata';

import { NativeUnit } from '../native.unit';

export class MultiStateInputUnit extends NativeUnit {
    public className: string = 'BinaryValueUnit';
    public metadata: IBACnetObject;

    constructor (edeUnit: IEDEUnit) {
        super(edeUnit, MultiStateInputMetadata);
    }

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);
    }
}
