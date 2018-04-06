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

import { DeviceMetadata } from './device.metadata';

import { NativeUnit } from '../native.unit';

export class DeviceUnit extends NativeUnit {
    public readonly className: string = 'DeviceUnit';

    constructor () {
        super();
        this.storage.addUnitStorage(DeviceMetadata);
    }

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);
    }
}
