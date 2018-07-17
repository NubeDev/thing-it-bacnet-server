import * as _ from 'lodash';

import {
    ApiError,
} from '../../../../core/errors';

import {
    UnitPropertyObject,
} from '../../../../core/interfaces';
import * as BACNet from 'tid-bacnet-logic';

import { IEDEUnit } from '../../../../core/interfaces';

import { MultiStateInputMetadata } from './multi-state-input.metadata';

import { MultiStateUnit } from '../multi-state.unit';

export class MultiStateInputUnit extends MultiStateUnit {
    public readonly className: string = 'MultiStateInputUnit';

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);

        this.storage.addUnitStorage(MultiStateInputMetadata);
    }
}
