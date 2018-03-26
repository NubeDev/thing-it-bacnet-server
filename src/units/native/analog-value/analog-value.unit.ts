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

import { AnalogValueMetadata } from './analog-value.metadata';

import { NativeUnit } from '../native.unit';

export class AnalogValueUnit extends NativeUnit {
    public className: string = 'BinaryValueUnit';
    public metadata: IBACnetObject;

    constructor (edeUnit: IEDEUnit) {
        super(edeUnit, AnalogValueMetadata);
    }

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);
    }
}
