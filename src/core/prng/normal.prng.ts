import * as _ from 'lodash';

import { IDistribution } from '../interfaces';

import { PRNGBase } from './prng.base';

/**
 * PRNG for normal (Gaussian or Gauss or Laplace-Gauss) distribution.
 * PRNG - pseudorandom number generator.
 *
 * @class
 */
export class NormalPRNG extends PRNGBase {

    /**
     * random - calculates the random value in [-1;1] range, relies on the
     * {@link https://en.wikipedia.org/wiki/Central_limit_theorem|central limit theorem (CLT)}.
     *
     * @return {number} - random value
     */
    protected random (): number {
        const size = 12;
        const halfOfSize = size / 2;

        let randValue = 0;
        for (let i = 0; i < size; i++) {
            randValue += Math.random();
        }

        return (randValue - halfOfSize) / halfOfSize;
    }

    /**
     * getOffsetInRange - calculates the offset of a random value in the range
     * from the "min" value.
     *
     * @return {number} - offset
     */
    protected getOffsetInRange (): number {
        return (this.opts.max - this.opts.min) * (this.random() + 1) / (this.opts.max + 1);
    }
}
