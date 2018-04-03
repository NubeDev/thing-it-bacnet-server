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

import { BinaryValueMetadata } from './binary-value.metadata';

import { NativeUnit } from '../native.unit';

export class BinaryValueUnit extends NativeUnit {
    public readonly className: string = 'BinaryValueUnit';

    constructor (edeUnit: IEDEUnit) {
        super(edeUnit, BinaryValueMetadata);
    }

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);
    }
}
