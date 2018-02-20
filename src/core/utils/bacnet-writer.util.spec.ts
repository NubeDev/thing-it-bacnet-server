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
            bacnetWriterUtil.writeObjectIdentifier(8, 9999);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x02);
            expect(buffer[1]).to.equal(0x00);
            expect(buffer[2]).to.equal(0x27);
            expect(buffer[3]).to.equal(0x0f);
        });
        it('should set object type 5 and object instance 46', () => {
            bacnetWriterUtil.writeObjectIdentifier(5, 46);
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
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x19);
            expect(buffer[1]).to.equal(0x08);
            expect(buffer[2]).to.equal(0x00);
        });
        it('should set tag 2/1/2 and param 0x6708', () => {
            bacnetWriterUtil.writeParam(0x6708, 2, 2);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x2A);
            expect(buffer[1]).to.equal(0x67);
            expect(buffer[2]).to.equal(0x08);
            expect(buffer[3]).to.equal(0x00);
        });
        it('should set tag 2/1/4 and param 0x12345678', () => {
            bacnetWriterUtil.writeParam(0x12345678, 2, 4);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x2C);
            expect(buffer[1]).to.equal(0x12);
            expect(buffer[2]).to.equal(0x34);
            expect(buffer[3]).to.equal(0x56);
            expect(buffer[4]).to.equal(0x78);
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
            expect(buffer[2]).to.equal(0x00);
        });
        it('should set tag 2/1/1 and param 0x4f', () => {
            bacnetWriterUtil.writeProperty(0x4f, 2);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x29);
            expect(buffer[1]).to.equal(0x4f);
            expect(buffer[2]).to.equal(0x00);
        });
    });

    describe('writeTypeBoolean', () => {
        let bacnetWriterUtil: BACnetWriterUtil;
        beforeEach(() => {
            bacnetWriterUtil = new BACnetWriterUtil();
        });

        it('should set opening tag, param tag with "true" value and closing tag', () => {
            bacnetWriterUtil.writeTypeBoolean(1, true);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x1e);
            expect(buffer[1]).to.equal(0x11);
            expect(buffer[2]).to.equal(0x1f);
        });
        it('should set opening tag, param tag with "false" value and closing tag', () => {
            bacnetWriterUtil.writeTypeBoolean(2, false);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x2e);
            expect(buffer[1]).to.equal(0x10);
            expect(buffer[2]).to.equal(0x2f);
        });
    });

    describe('writeTypeUnsignedInt', () => {
        let bacnetWriterUtil: BACnetWriterUtil;
        beforeEach(() => {
            bacnetWriterUtil = new BACnetWriterUtil();
        });

        it('should set opening tag, param tag with "true" value and closing tag', () => {
            bacnetWriterUtil.writeTypeUnsignedInt(1, 0x23);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x1e);
            expect(buffer[1]).to.equal(0x21);
            expect(buffer[2]).to.equal(0x23);
            expect(buffer[3]).to.equal(0x1f);
        });
        it('should set opening tag, param tag with "true" value and closing tag', () => {
            bacnetWriterUtil.writeTypeUnsignedInt(3, 0x34);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x3e);
            expect(buffer[1]).to.equal(0x21);
            expect(buffer[2]).to.equal(0x34);
            expect(buffer[3]).to.equal(0x3f);
        });
    });

    describe('writeTypeReal', () => {
        let bacnetWriterUtil: BACnetWriterUtil;
        beforeEach(() => {
            bacnetWriterUtil = new BACnetWriterUtil();
        });

        it('should set opening tag, param tag, param value 22.5 and closing tag', () => {
            bacnetWriterUtil.writeTypeReal(1, 22.5);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x1e);
            expect(buffer[1]).to.equal(0x44);
            expect(buffer[2]).to.equal(0x41);
            expect(buffer[3]).to.equal(0xb4);
            expect(buffer[4]).to.equal(0x00);
            expect(buffer[5]).to.equal(0x00);
            expect(buffer[6]).to.equal(0x1f);
        });
        it('should set opening tag, param tag, param value 25.2 value and closing tag', () => {
            bacnetWriterUtil.writeTypeReal(3, 25.2);
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x3e);
            expect(buffer[1]).to.equal(0x44);
            expect(buffer[2]).to.equal(0x41);
            expect(buffer[3]).to.equal(0xc9);
            expect(buffer[4]).to.equal(0x99);
            expect(buffer[5]).to.equal(0x9a);
            expect(buffer[6]).to.equal(0x3f);
        });
    });

    describe('writeTypeCharString', () => {
        let bacnetWriterUtil: BACnetWriterUtil;
        beforeEach(() => {
            bacnetWriterUtil = new BACnetWriterUtil();
        });

        it('should set opening tag, param tag, param len, param encod, param value "L02" and closing tag', () => {
            bacnetWriterUtil.writeTypeCharString(1, 'L02');
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x1e);
            expect(buffer[1]).to.equal(0x75);
            expect(buffer[2]).to.equal(0x03);
            expect(buffer[3]).to.equal(0x00);
            expect(buffer[4]).to.equal(0x4c);
            expect(buffer[5]).to.equal(0x30);
            expect(buffer[6]).to.equal(0x32);
            expect(buffer[7]).to.equal(0x1f);
        });

        it('should set opening tag, param tag, param len, param encod, param value "L202" and closing tag', () => {
            bacnetWriterUtil.writeTypeCharString(1, 'L202');
            const buffer = bacnetWriterUtil.getBuffer();
            expect(buffer[0]).to.equal(0x1e);
            expect(buffer[1]).to.equal(0x75);
            expect(buffer[2]).to.equal(0x04);
            expect(buffer[3]).to.equal(0x00);
            expect(buffer[4]).to.equal(0x4c);
            expect(buffer[5]).to.equal(0x32);
            expect(buffer[6]).to.equal(0x30);
            expect(buffer[7]).to.equal(0x32);
            expect(buffer[8]).to.equal(0x1f);
        });
    });
});
