// Import all chai for type matching with "chai-as-promised" lib
import * as chai from 'chai';

import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';

import { ApiError } from '../errors';

import { BACnetWriterUtil } from './bacnet-writer.util';

/* Interfaces */

describe('BACnetWriterUtil', () => {
    describe('writeUInt8', () => {
        let bacnetWriterUtil: BACnetWriterUtil;
        beforeEach(() => {
            bacnetWriterUtil = new BACnetWriterUtil();
        });
        it('should set the 0x2c value in position 0', () => {
            bacnetWriterUtil.writeUInt8(0x2c);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x2c);
            expect(buffer[1]).to.be.undefined;
        });
        it('should set the 0x2c/0x0a value in position 0/1', () => {
            bacnetWriterUtil.writeUInt8(0x2c);
            bacnetWriterUtil.writeUInt8(0x0a);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x2c);
            expect(buffer[1]).to.equal(0x0a);
            expect(buffer[2]).to.be.undefined;
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
            expect(buffer[2]).to.be.undefined;
        });
        it('should set the 0x4f2c/0x120a value in position 0-1/1-2', () => {
            bacnetWriterUtil.writeUInt16BE(0x4f2c);
            bacnetWriterUtil.writeUInt16BE(0x120a);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x4f);
            expect(buffer[1]).to.equal(0x2c);
            expect(buffer[2]).to.equal(0x12);
            expect(buffer[3]).to.equal(0x0a);
            expect(buffer[4]).to.be.undefined;
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
            expect(buffer[4]).to.be.undefined;
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
            expect(buffer[8]).to.be.undefined;
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
            expect(buffer[3]).to.be.undefined;
        });
        it('should set the 0x2c/"LI2" value in position 0/1-3', () => {
            bacnetWriterUtil.writeUInt8(0x2c);
            bacnetWriterUtil.writeString('LI2');
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x2c);
            expect(buffer[1]).to.equal(0x4c);
            expect(buffer[2]).to.equal(0x49);
            expect(buffer[3]).to.equal(0x32);
            expect(buffer[4]).to.be.undefined;
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
            expect(buffer[5]).to.be.undefined;
        });
    });

    describe('writeTag', () => {
        let bacnetWriterUtil: BACnetWriterUtil;
        beforeEach(() => {
            bacnetWriterUtil = new BACnetWriterUtil();
        });

        it('should set tag 2/0/2', () => {
            bacnetWriterUtil.writeTag(2, 0, 2);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x22);
        });
        it('should set tag 12/0/4', () => {
            bacnetWriterUtil.writeTag(12, 0, 4);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0xc4);
        });
        it('should set tag 1/1/1', () => {
            bacnetWriterUtil.writeTag(1, 1, 1);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x19);
        });
        it('should set tag 2/1/4', () => {
            bacnetWriterUtil.writeTag(2, 1, 4);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x2c);
        });
        it('should set tag 12/0/4 and byte 0x2c', () => {
            bacnetWriterUtil.writeTag(12, 0, 4);
            bacnetWriterUtil.writeUInt8(0x2c);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0xc4);
            expect(buffer[1]).to.equal(0x2c);
        });
        it('should set tag 1/1/1 and byte 0x1f', () => {
            bacnetWriterUtil.writeTag(1, 1, 1);
            bacnetWriterUtil.writeUInt8(0x1f);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x19);
            expect(buffer[1]).to.equal(0x1f);
        });
    });

    describe('writeObjectIdentifier', () => {
        let bacnetWriterUtil: BACnetWriterUtil;
        beforeEach(() => {
            bacnetWriterUtil = new BACnetWriterUtil();
        });

        it('should set object type 8 and object instance 9999', () => {
            bacnetWriterUtil.writeObjectIdentifier({ type: 8, instance: 9999 });
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x02);
            expect(buffer[1]).to.equal(0x00);
            expect(buffer[2]).to.equal(0x27);
            expect(buffer[3]).to.equal(0x0f);
        });
        it('should set object type 5 and object instance 46', () => {
            bacnetWriterUtil.writeObjectIdentifier({ type: 5, instance: 46 });
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x01);
            expect(buffer[1]).to.equal(0x40);
            expect(buffer[2]).to.equal(0x00);
            expect(buffer[3]).to.equal(0x2e);
        });
    });

    describe('writeParam', () => {
        let bacnetWriterUtil: BACnetWriterUtil;
        beforeEach(() => {
            bacnetWriterUtil = new BACnetWriterUtil();
        });

        it('should set tag 1/1/1 and param 0x08', () => {
            bacnetWriterUtil.writeParam(0x08, 1);

            const writerBuffer = bacnetWriterUtil.getBuffer();
            const proposedBuffer = Buffer.from([ 0x19, 0x08 ]);
            expect(writerBuffer).to.deep.equal(proposedBuffer);
        });
        it('should set tag 2/1/2 and param 0x6708', () => {
            bacnetWriterUtil.writeParam(0x6708, 2, 0);

            const writerBuffer = bacnetWriterUtil.getBuffer();
            const proposedBuffer = Buffer.from([ 0x22, 0x67, 0x08 ]);
            expect(writerBuffer).to.deep.equal(proposedBuffer);
        });
        it('should set tag 2/1/4 and param 0x12345678', () => {
            bacnetWriterUtil.writeParam(0x12345678, 2);

            const writerBuffer = bacnetWriterUtil.getBuffer();
            const proposedBuffer = Buffer.from([ 0x2C, 0x12, 0x34, 0x56, 0x78 ]);
            expect(writerBuffer).to.deep.equal(proposedBuffer);
        });
    });

    describe('writeProperty', () => {
        let bacnetWriterUtil: BACnetWriterUtil;
        beforeEach(() => {
            bacnetWriterUtil = new BACnetWriterUtil();
        });

        it('should set tag 1/1/1 and param 0x08', () => {
            bacnetWriterUtil.writeProperty(0x08, 1);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x19);
            expect(buffer[1]).to.equal(0x08);
            expect(buffer[2]).to.be.undefined;
        });
        it('should set tag 2/1/1 and param 0x4f', () => {
            bacnetWriterUtil.writeProperty(0x4f, 2);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x29);
            expect(buffer[1]).to.equal(0x4f);
            expect(buffer[2]).to.be.undefined;
        });
    });
});
