import * as _ from 'lodash';

import {
    ApiError,
} from '../../../core/errors';


import {
    IEDEUnit,
} from '../../../core/interfaces';

import { UnitStorage } from '../../unit.storage';

export class MiddleUnit {
    public readonly className: string = 'MiddleUnit';

    static createAndBind (storage: UnitStorage, edeUnit?: IEDEUnit) {
        const newInst = new this(storage);
        newInst.initMiddle(edeUnit);
        return newInst;
    }

    constructor (protected storage: UnitStorage) {
    }

    /**
     * initMiddle - initializes the middle unit.
     *
     * @param  {IEDEUnit} edeUnit -  ede unit configuration
     * @return {void}
     */
    public initMiddle (edeUnit?: IEDEUnit): void {
        this.sjHandler();
    }

    /**
     * sjHandler - handles the changes of properties.
     *
     * @return {void}
     */
    public sjHandler (): void {
    }
}
