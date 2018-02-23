// Import all chai for type matching with "chai-as-promised" lib
import * as chai from 'chai';

import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';

import { ApiError } from '../errors';

import { NPDU } from './npdu.layer';
import { APDU } from './apdu.layer';

/* Interfaces */

class APDUMock {
    public getFromBuffer() {
        return null;
    }
}

describe('NPDU', () => {
    describe('getFromBuffer', () => {
        let npdu: NPDU;
        let buf: Buffer;
        let apduMock;

        beforeEach(() => {
            buf = Buffer.from([0x01, 0x20, 0xff,
                0xff, 0x00, 0xff, 0x10, 0x00, 0xc4, 0x02, 0x00,
                0x27, 0x0f, 0x22, 0x05, 0xc4, 0x91, 0x00, 0x21, 0xb2]);
            apduMock = new APDUMock() as any as APDU;
            npdu = new NPDU(apduMock);
        });

        it('should return Map with correct metadata', () => {
            const newBuf = npdu.getFromBuffer(buf);
            expect(newBuf.get('version')).to.equal(0x01);
            const control = newBuf.get('control');
            expect(control.get('noApduMessageType')).to.be.false;
            expect(control.get('reserved1')).to.equal(0);
            expect(control.get('destSpecifier')).to.be.true;
            expect(control.get('reserved2')).to.equal(0);
            expect(control.get('srcSpecifier')).to.be.false;
            expect(control.get('expectingReply')).to.be.false;
            expect(control.get('priority1')).to.equal(0);
            expect(control.get('priority2')).to.equal(0);
            expect(newBuf.get('hopCount')).to.equal(255);
        });

        it('should slice the buffer correctly', () => {
            let spyAPDUGetFromBuffer = spy(apduMock, 'getFromBuffer');
            const newBuf = npdu.getFromBuffer(buf);
            const slicedBuffer = Buffer.from([0x10, 0x00, 0xc4, 0x02, 0x00,
                0x27, 0x0f, 0x22, 0x05, 0xc4, 0x91, 0x00, 0x21, 0xb2]);
            expect(spyAPDUGetFromBuffer.args[0][0]).to.deep.equal(slicedBuffer);
        });
    });
});
