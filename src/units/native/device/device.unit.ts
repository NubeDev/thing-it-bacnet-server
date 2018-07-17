import * as _ from 'lodash';

// import {
//     BACnetPropertyId,
// } from '../../../core/bacnet/enums';

import {
    ApiError,
} from '../../../core/errors';

import {
    UnitPropertyObject,
} from '../../../core/interfaces';

import { IEDEUnit } from '../../../core/interfaces';

import { DeviceMetadata } from './device.metadata';

import { NativeUnit } from '../native.unit';

export class DeviceUnit extends NativeUnit {
    public readonly className: string = 'DeviceUnit';

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);

        this.storage.addUnitStorage(DeviceMetadata);
    }
}
