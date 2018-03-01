import * as _ from 'lodash';

import {
    BACnetPropIds,
} from '../../../core/enums';

import { BinaryValueMetadata } from './binary-value.metadata';

import { UnitBase } from '../../../core/bases/unit.base';

export class BinaryValueUnit extends UnitBase {
    public metadata: any;

    constructor (bnModule: any) {
        super();
        this.metadata = _.cloneDeep(BinaryValueMetadata);
        this.setProps(bnModule.config);
    }

    public getBACnetObjects () {
        return _.cloneDeep(this.metadata);
    }
}
