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

import { AnalogOutputMetadata } from './analog-output.metadata';

import { NativeUnit } from '../native.unit';

export class AnalogOutputUnit extends NativeUnit {
    public readonly className: string = 'AnalogOutputUnit';

    constructor () {
        super();
        this.storage.addUnitStorage(AnalogOutputMetadata);
    }

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);
    }
}
