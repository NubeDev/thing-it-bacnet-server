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

import { AnalogOutputMetadata } from './analog-output.metadata';
import { CommandableMiddleUnit } from '../../middles/commandable/commandable.middle';

import { NativeUnit } from '../../native.unit';

export class AnalogOutputUnit extends NativeUnit {
    public readonly className: string = 'AnalogOutputUnit';

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);

        CommandableMiddleUnit.createAndBind(this.storage);
        this.storage.addUnitStorage(AnalogOutputMetadata);

        this.storage.dispatch();
    }

    /**
     * sjHandler - handles the changes of properties.
     *
     * @param  {IBACnetObjectProperty} notif - notification object
     * @return {void}
     */
    public sjHandler (): void {
        super.sjHandler();
    }
}
