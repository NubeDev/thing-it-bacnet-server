import * as _ from 'lodash';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

import {
    BACnetPropIds,
} from '../../../core/enums';

import {
    ApiError,
} from '../../../core/errors';

import {
    IBACnetObjectProperty,
    IBACnetTypeObjectId,
    IEDEUnit,
    ICustomFunction,
} from '../../../core/interfaces';

import { UnitStorage } from '../../unit.storage';
import { FunctionMetadata } from './function.metadata';

import * as BACnetTypes from '../../../core/types';

import {
    logger,
    TyperUtil,
} from '../../../core/utils';

import { CustomUnit } from '../custom.unit';

export class FunctionUnit extends CustomUnit {
    public readonly className: string = 'FunctionUnit';

    /**
     * initUnit - inits the custom unit.
     *
     * @return {void}
     */
    public initUnit (): void {
        super.initUnit();

        this.addMetadata(FunctionMetadata);
    }
}
