import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';

import { ApiError } from '../errors';

import { CSVRow } from './row.csv';

describe('CSVRow', () => {
    describe('constructor', () => {
        it('should create empty cell storage', () => {
            const row = new CSVRow();

            expect(row['storage']).to.not.be.null;
            expect(row['storage'].size).to.equal(0);
        });

        it('should create cell storage with few cells (separator - comma)', () => {
            const row = new CSVRow('cell1,cell2');

            expect(row['storage']).to.not.be.null;
            expect(row['storage'].size).to.equal(2);
        });

        it('should create cell storage with few cells (separator - semicolon)', () => {
            const row = new CSVRow('cell1;cell2;cell3');

            expect(row['storage']).to.not.be.null;
            expect(row['storage'].size).to.equal(3);
        });
    });

    describe('destroy', () => {
        it('should destroy cell storage', () => {
            const row = new CSVRow();

            row.destroy();

            expect(row['storage']).to.be.null;
        });
    });
});
