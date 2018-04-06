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

import { NoopMetadata } from './noop.metadata';

import { NativeUnit } from '../native.unit';

export class NoopUnit extends NativeUnit {
    public readonly className: string = 'NoopUnit';

    constructor () {
        super();
        this.storage.addUnitStorage(NoopMetadata);
    }

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);
    }
}
