import * as _ from 'lodash';

import {
    ApiError,
} from '../../../core/errors';

import {
    UnitStorageProperty,
} from '../../../core/interfaces';

import { IEDEUnit } from '../../../core/interfaces';

import { DeviceMetadata } from './device.metadata';

import { NativeUnit } from '../native.unit';
import * as BACNet from 'tid-bacnet-logic';

export class DeviceUnit extends NativeUnit {
    public readonly className: string = 'DeviceUnit';

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);

        this.storage.addUnitStorage(DeviceMetadata);

        const objId = this.storage.getProperty(BACNet.Enums.PropertyId.objectIdentifier).payload as BACNet.Types.BACnetObjectId;

        this.storage.updateProperty({
            id: BACNet.Enums.PropertyId.objectList,
            payload: [objId]
        })
    }
}
