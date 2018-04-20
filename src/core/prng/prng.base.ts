import * as _ from 'lodash';

import { IDistribution } from '../interfaces';

/**
 * Base class for all PRNG.
 * PRNG - pseudorandom number generator.
 *
 * @class
 */
export class PRNGBase {

    constructor (protected opts: IDistribution) {
    }

    /**
     * random - calculates the random value.
     *
     * @return {number} - random value
     */
    protected random (): number {
        return null;
    }

    /**
     * getOffsetInRange - calculates the offset of a random value in the range
     * from the "min" value.
     *
     * @return {number} - offset
     */
    protected getOffsetInRange (): number {
        return null;
    }

    /**
     * next - calculates new float random value in specific range.
     *
     * @return {number} - float random value
     */
    public next (): number {
        return this.opts.min + this.getOffsetInRange();
    }

    /**
     * nextInteger - calculates new integer random value in specific range.
     *
     * @return {number} - integer random value
     */
    public nextInteger (): number {
        return this.opts.min + Math.floor(this.getOffsetInRange());
    }
}
