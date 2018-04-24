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

    describe('getCellValue', () => {
        it('should return empty string if cell storage is empty', () => {
            const row = new CSVRow();

            expect(row.getCellValue(0)).to.equal('');
        });

        it('should return empty string if value does not exist in cell storage (separator - comma)', () => {
            const row = new CSVRow('cell1,cell2');

            expect(row.getCellValue(2)).to.equal('');
        });

        it('should return empty string if value does not exist in cell storage (separator - semicolon)', () => {
            const row = new CSVRow('cell3;cell4;cell5');

            expect(row.getCellValue(3)).to.equal('');
        });

        it('should return correct cell values from the cell storage (separator - comma)', () => {
            const row = new CSVRow('cell1,cell2');

            expect(row.getCellValue(0)).to.equal('cell1');
            expect(row.getCellValue(1)).to.equal('cell2');
        });

        it('should return correct cell values from the cell storage (separator - semicolon)', () => {
            const row = new CSVRow('cell3;cell4;cell5');

            expect(row.getCellValue(0)).to.equal('cell3');
            expect(row.getCellValue(1)).to.equal('cell4');
            expect(row.getCellValue(2)).to.equal('cell5');
        });
    });
});
