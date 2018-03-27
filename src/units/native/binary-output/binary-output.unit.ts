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

import { BinaryOutputMetadata } from './binary-output.metadata';

import { NativeUnit } from '../native.unit';

export class BinaryOutputUnit extends NativeUnit {
    public readonly className: string = 'BinaryOutputUnit';
    public metadata: IBACnetObjectProperty[];

    constructor (edeUnit: IEDEUnit) {
        super(edeUnit, BinaryOutputMetadata);
    }

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);
    }
}
