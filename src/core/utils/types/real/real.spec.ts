import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';

import { BACnetReal } from './real.type';

import { BACnetWriterUtil } from '../../bacnet-writer.util';
import { BACnetReaderUtil } from '../../bacnet-reader.util';

describe('BACnetReal', () => {
    describe('readValue', () => {
        let bacnetReal: BACnetReal;
        let bacnetReaderUtil: BACnetReaderUtil;

        beforeEach(() => {
            bacnetReal = new BACnetReal();
        });

        it('should read correct tag', () => {
            bacnetReaderUtil = new BACnetReaderUtil(Buffer.from([
                0x44, 0x41, 0xb4, 0x00, 0x00,
            ]));
            bacnetReal.readValue(bacnetReaderUtil);

            const tag = bacnetReal.getTag();
            expect(tag).to.deep.equal({ num: 4, type: 0, value: 4 });
        });

        it('should read "0x12" value', () => {
            bacnetReaderUtil = new BACnetReaderUtil(Buffer.from([
                0x44, 0x41, 0xb4, 0x00, 0x00,
            ]));
            bacnetReal.readValue(bacnetReaderUtil);

            const value = bacnetReal.getValue();
            expect(value).to.equal(22.5);
        });

        it('should read "0x44" value', () => {
            bacnetReaderUtil = new BACnetReaderUtil(Buffer.from([
                0x44, 0x41, 0xc9, 0x99, 0x9a,
            ]));
            bacnetReal.readValue(bacnetReaderUtil);

            const value = bacnetReal.getValue();
            expect(value).to.equal(25.2);
        });
    });

    // describe('writeValue', () => {
    //     let bacnetReal: BACnetReal;
    //     let bacnetWriterUtil: BACnetWriterUtil;
    //
    //     beforeEach(() => {
    //         bacnetWriterUtil = new BACnetWriterUtil();
    //     });
    //
    //     it('should write correct buffer for "true" value', () => {
    //         bacnetReal = new BACnetReal(0x12);
    //         bacnetReal.writeValue(bacnetWriterUtil);
    //
    //         const writerBuffer = bacnetWriterUtil.getBuffer();
    //         const proposedBuffer = Buffer.from([0x91, 0x12]);
    //         expect(writerBuffer).to.deep.equal(proposedBuffer);
    //     });
    //
    //     it('should write correct buffer for "false" value', () => {
    //         bacnetReal = new BACnetReal(0x44);
    //         bacnetReal.writeValue(bacnetWriterUtil);
    //
    //         const writerBuffer = bacnetWriterUtil.getBuffer();
    //         const proposedBuffer = Buffer.from([0x91, 0x44]);
    //         expect(writerBuffer).to.deep.equal(proposedBuffer);
    //     });
    // });
});
