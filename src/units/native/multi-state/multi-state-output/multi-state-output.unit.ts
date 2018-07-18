import * as _ from 'lodash';

import { ApiError } from '../../../../core/errors';

import {
    UnitPropertyObject,
} from '../../../../core/interfaces';

import { IEDEUnit } from '../../../../core/interfaces';

import { MultiStateOutputMetadata } from './multi-state-output.metadata';

import { MultiStateUnit } from '../multi-state.unit';

export class MultiStateOutputUnit extends MultiStateUnit {
    public readonly className: string = 'MultiStateOutputUnit';

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);

        this.storage.addUnitStorage(MultiStateOutputMetadata);
    }
}
