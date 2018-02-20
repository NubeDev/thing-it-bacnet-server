// Import all chai for type matching with "chai-as-promised" lib
import * as chai from 'chai';

import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';

import { ApiError } from '../errors';

import { BACnetWriterUtil } from './bacnet-writer.util';

/* Interfaces */

describe('ConverterUtil', () => {
    describe('writeUInt8', () => {
        let bacnetWriterUtil: BACnetWriterUtil;
        beforeEach(() => {
            bacnetWriterUtil = new BACnetWriterUtil();
        });
        it('should set the 0x2c value in position 0', () => {
            bacnetWriterUtil.writeUInt8(0x2c);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x2c);
        });
        it('should set the 0x2c/0x0a value in position 0/1', () => {
            bacnetWriterUtil.writeUInt8(0x2c);
            bacnetWriterUtil.writeUInt8(0x0a);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x2c);
            expect(buffer[1]).to.equal(0x0a);
        });
    });

    describe('writeUInt16BE', () => {
        let bacnetWriterUtil: BACnetWriterUtil;
        beforeEach(() => {
            bacnetWriterUtil = new BACnetWriterUtil();
        });
        it('should set the 0x4f2c value in position 0-1', () => {
            bacnetWriterUtil.writeUInt16BE(0x4f2c);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x4f);
            expect(buffer[1]).to.equal(0x2c);
        });
        it('should set the 0x4f2c/0x120a value in position 0-1/1-2', () => {
            bacnetWriterUtil.writeUInt16BE(0x4f2c);
            bacnetWriterUtil.writeUInt16BE(0x120a);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x4f);
            expect(buffer[1]).to.equal(0x2c);
            expect(buffer[2]).to.equal(0x12);
            expect(buffer[3]).to.equal(0x0a);
        });
    });

    describe('writeUInt32BE', () => {
        let bacnetWriterUtil: BACnetWriterUtil;
        beforeEach(() => {
            bacnetWriterUtil = new BACnetWriterUtil();
        });
        it('should set the 0x120a4f2c value in position 0-3', () => {
            bacnetWriterUtil.writeUInt32BE(0x120a4f2c);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x12);
            expect(buffer[1]).to.equal(0x0a);
            expect(buffer[2]).to.equal(0x4f);
            expect(buffer[3]).to.equal(0x2c);
        });
        it('should set the 0x120a4f2c/0x12345678 value in position 0-3/4-7', () => {
            bacnetWriterUtil.writeUInt32BE(0x120a4f2c);
            bacnetWriterUtil.writeUInt32BE(0x12345678);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x12);
            expect(buffer[1]).to.equal(0x0a);
            expect(buffer[2]).to.equal(0x4f);
            expect(buffer[3]).to.equal(0x2c);
            expect(buffer[4]).to.equal(0x12);
            expect(buffer[5]).to.equal(0x34);
            expect(buffer[6]).to.equal(0x56);
            expect(buffer[7]).to.equal(0x78);
        });
    });

    describe('writeString', () => {
        let bacnetWriterUtil: BACnetWriterUtil;
        beforeEach(() => {
            bacnetWriterUtil = new BACnetWriterUtil();
        });

        it('should set the "L02" value in position 0-2', () => {
            bacnetWriterUtil.writeString('L02');
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x4c);
            expect(buffer[1]).to.equal(0x30);
            expect(buffer[2]).to.equal(0x32);
        });
        it('should set the 0x2c/"LI2" value in position 0/1-3', () => {
            bacnetWriterUtil.writeUInt8(0x2c);
            bacnetWriterUtil.writeString('LI2');
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x2c);
            expect(buffer[1]).to.equal(0x4c);
            expect(buffer[2]).to.equal(0x49);
            expect(buffer[3]).to.equal(0x32);
            expect(buffer[4]).to.equal(0x00);
        });
        it('should set the 0x1f/"LI2"/0x0a value in position 0/1-3/4', () => {
            bacnetWriterUtil.writeUInt8(0x1f);
            bacnetWriterUtil.writeString('LI2');
            bacnetWriterUtil.writeUInt8(0x0a);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x1f);
            expect(buffer[1]).to.equal(0x4c);
            expect(buffer[2]).to.equal(0x49);
            expect(buffer[3]).to.equal(0x32);
            expect(buffer[4]).to.equal(0x0a);
            expect(buffer[5]).to.equal(0x00);
        });
    });
});
