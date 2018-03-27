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

import { BinaryInputMetadata } from './binary-input.metadata';

import { NativeUnit } from '../native.unit';

export class BinaryInputUnit extends NativeUnit {
    public readonly className: string = 'BinaryInputUnit';
    public metadata: IBACnetObjectProperty[];

    constructor (edeUnit: IEDEUnit) {
        super(edeUnit, BinaryInputMetadata);
    }

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);
    }
}
