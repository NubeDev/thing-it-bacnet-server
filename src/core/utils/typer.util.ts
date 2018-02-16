import * as _ from 'lodash';

import { ApiError } from '../errors';

export class TyperUtil {

    static getBit (value: number, pos: number): number {
        const bit: number = (value >> pos) & 0x01;
        return bit;
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
