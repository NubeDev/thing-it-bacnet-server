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

import { MultiStateValueMetadata } from './multi-state-value.metadata';

import { MultiStateUnit } from '../multi-state.unit';

export class MultiStateValueUnit extends MultiStateUnit {
    public readonly className: string = 'MultiStateValueUnit';

    constructor () {
        super();
        this.storage.addUnitStorage(MultiStateValueMetadata);
    }

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);
    }
}
