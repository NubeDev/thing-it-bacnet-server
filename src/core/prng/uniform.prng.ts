import * as _ from 'lodash';

import { IDistribution } from '../interfaces';

import { PRNGBase } from './prng.base';

/**
 * PRNG for uniform distribution.
 * PRNG - pseudorandom number generator.
 *
 * @class
 */
export class UniformPRNG extends PRNGBase {

    /**
     * random - calculates the random value in [0;1] range.
     *
     * @return {number} - random value
     */
    protected random (): number {
        return Math.random();
    }

    /**
     * getOffsetInRange - calculates the offset of a random value in the range
     * from the "min" value.
     *
     * @return {number} - offset
     */
    protected getOffsetInRange (): number {
        return this.random() * (this.opts.max - this.opts.min);
    }
}
