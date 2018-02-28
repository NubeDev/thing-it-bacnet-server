import * as _ from 'lodash';
import { Subject } from 'rxjs';

import {
    BACnetPropIds,
} from '../core/enums';

import {
    UnitBase,
} from '../core/bases/unit.base';

import { DeviceMetadata } from './device.metadata';

import { UnitModule } from './unit.module';

export class DeviceUnit extends UnitBase {
    public metadata: any;
    private nfData: Subject<any>;

    constructor (bnModule: any) {
        super();
        this.metadata = _.cloneDeep(DeviceMetadata);
        this.nfData = new Subject();
        this.setProps(bnModule.config);
    }

    public createModule (units: any[]) {
        // TODO:
        _.map(units, (unit) => {
            ;
        });
    }
}
