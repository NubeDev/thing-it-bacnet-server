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

import { MultiStateOutputMetadata } from './multi-state-output.metadata';

import { MultiStateUnit } from '../multi-state.unit';

export class MultiStateOutputUnit extends MultiStateUnit {
    public readonly className: string = 'MultiStateOutputUnit';

    constructor () {
        super();
        this.storage.addUnitStorage(MultiStateOutputMetadata);
    }

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);
    }
}
