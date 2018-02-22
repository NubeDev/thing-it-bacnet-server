import * as _ from 'lodash';

import { ApiError } from '../errors';

export class TyperUtil {

    static setBit (numValue: number, pos: number, bitValue: boolean): number {
        const byte = 0x01 << pos;
        const mask = bitValue ? byte : ~byte;
        return bitValue ? (numValue | mask) : (numValue & mask);
    }

    static getBit (value: number, pos: number): number {
        const bit: number = (value >> pos) & 0x01;
        return bit;
    }

    static getBitRange (value: number, startPos: number, len: number): number {
        const mask = Math.pow(2, len) - 1;
        const range = (value >> startPos) & mask;
        return range;
    }

    /**
     * setBitRange - sets the value in specific the range of bits.
     *
     * @param  {number} bitMap - old value
     * @param  {number} newValue - new value for range
     * @param  {number} startPos - start position
     * @param  {number} len - number of bits
     * @return {number}
     */
    static setBitRange (bitMap: number, newValue: number,
            startPos: number, len: number): number {
        const mask = Math.pow(2, len) - 1;
        const newValueMask = (newValue & mask) << startPos;
        const bitMapMask = ~(mask << startPos);
        return (bitMap & bitMapMask) | newValueMask;
    }

    static getByte (value: number, pos: number): number {
        const byte: number = (value >> (pos * 8)) & 0x0F;
        return byte;
    }

    static getWord (value: number, pos: number): number {
        const word: number = (value >> (pos * 16)) & 0xFF;
        return word;
    }
}
