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

import { AnalogInputMetadata } from './analog-input.metadata';

import { NativeUnit } from '../native.unit';

export class AnalogInputUnit extends NativeUnit {
    public readonly className: string = 'AnalogInputUnit';

    constructor () {
        super();
        this.storage.addUnitStorage(AnalogInputMetadata);
    }

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);
    }
}
