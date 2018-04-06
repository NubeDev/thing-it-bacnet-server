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

import { AnalogValueMetadata } from './analog-value.metadata';

import { NativeUnit } from '../native.unit';

export class AnalogValueUnit extends NativeUnit {
    public readonly className: string = 'AnalogValueUnit';

    constructor () {
        super();
        this.storage.addUnitStorage(AnalogValueMetadata);
    }

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);
    }
}
