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

import * as BACnetTypes from '../../../core/utils/types';

import {
    logger,
    TyperUtil,
} from '../../../core/utils';

import { CustomUnit } from '../custom.unit';

export class FunctionUnit extends CustomUnit {
    public readonly className: string = 'FunctionUnit';
}
