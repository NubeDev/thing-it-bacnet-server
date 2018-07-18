import * as _ from 'lodash';

import {
    ApiError,
} from '../../../../core/errors';

import {
    UnitStorageProperty,
} from '../../../../core/interfaces';

import { IEDEUnit } from '../../../../core/interfaces';

import { MultiStateValueMetadata } from './multi-state-value.metadata';

import { MultiStateUnit } from '../multi-state.unit';
import * as BACNet from 'tid-bacnet-logic';

export class MultiStateValueUnit extends MultiStateUnit {
    public readonly className: string = 'MultiStateValueUnit';

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);

        this.storage.addUnitStorage(MultiStateValueMetadata);
    }
}
