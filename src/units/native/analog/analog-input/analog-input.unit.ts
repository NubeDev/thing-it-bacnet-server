import * as _ from 'lodash';

import {
    BACnetPropIds,
} from '../../../../core/enums';

import {
    ApiError,
} from '../../../../core/errors';

import {
    IBACnetObjectProperty,
    IEDEUnit,
} from '../../../../core/interfaces';

import { AnalogInputMetadata } from './analog-input.metadata';

import { NativeUnit } from '../../native.unit';

export class AnalogInputUnit extends NativeUnit {
    public readonly className: string = 'AnalogInputUnit';

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);

        this.storage.addUnitStorage(AnalogInputMetadata);
    }
}
