// Import all chai for type matching with "chai-as-promised" lib
import * as chai from 'chai';

import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';

import { ApiError } from '../errors';

import { BLVC } from './blvc.layer';
import { NPDU } from './npdu.layer';

/* Interfaces */

class NPDUMock {
    public getFromBuffer() {
        return null;
    }
}

describe('BLVC', () => {
    describe('getFromBuffer', () => {
        let blvc: BLVC;
        let buf: Buffer;
        let npduMock;

        beforeEach(() => {
            buf = Buffer.from([0x81, 0x0b, 0x00, 0x18, 0x01, 0x20, 0xff,
                0xff, 0x00, 0xff, 0x10, 0x00, 0xc4, 0x02, 0x00,
                0x27, 0x0f, 0x22, 0x05, 0xc4, 0x91, 0x00, 0x21, 0xb2]);
            npduMock = new NPDUMock() as any as NPDU;
            blvc = new BLVC(npduMock);
        });

        it('should return Map with correct metadata', () => {
            const newBuf = blvc.getFromBuffer(buf);
            expect(newBuf.get('type')).to.equal(0x81);
            expect(newBuf.get('function')).to.equal(0x0b);
            expect(newBuf.get('lenght')).to.equal(0x18);
        });

        it('should slice the buffer correctly', () => {
            let spyNPDUGetFromBuffer = spy(npduMock, 'getFromBuffer');
            const newBuf = blvc.getFromBuffer(buf);
            const slicedBuffer = Buffer.from([0x01, 0x20, 0xff,
                0xff, 0x00, 0xff, 0x10, 0x00, 0xc4, 0x02, 0x00,
                0x27, 0x0f, 0x22, 0x05, 0xc4, 0x91, 0x00, 0x21, 0xb2]);
            expect(spyNPDUGetFromBuffer.args[0][0]).to.deep.equal(slicedBuffer);
        });
    });
});
