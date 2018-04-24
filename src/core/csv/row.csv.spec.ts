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

    describe('setCellValue', () => {
        it('should throw error if alias does not exist', () => {
            const row = new CSVRow();

            let testError: any = {};

            try {
                row.setCellValue(2, 'hello!');
            } catch (error) {
                testError = error;
            }

            expect(testError.name).to.equal('ApiError');
            expect(testError.message).to.equal('CSVRow - setCellValue: Alias does not exist!');
        });

        it('should set new value if value exist in cell storage (separator - comma)', () => {
            const row = new CSVRow('cell1,cell2');

            expect(row.getCellValue(0)).to.equal('cell1');

            row.setCellValue(0, 'new cell value');

            expect(row.getCellValue(0)).to.equal('new cell value');
        });

        it('should set new value if value exist in cell storage (separator - semicolon)', () => {
            const row = new CSVRow('cell3;cell4;cell5');

            expect(row.getCellValue(0)).to.equal('cell3');

            row.setCellValue(0, 'very new cell value');

            expect(row.getCellValue(0)).to.equal('very new cell value');
        });
    });

    describe('setCellAlias', () => {
        it('should throw error if alias storage is empty', () => {
            const row = new CSVRow();

            let testError: any = {};

            try {
                row.setCellAlias(2, 'hello!');
            } catch (error) {
                testError = error;
            }

            expect(testError.name).to.equal('ApiError');
            expect(testError.message).to.equal('CSVRow - setCellAlias: Alias does not exist!');
        });

        it('should throw error if alias does not exist', () => {
            const row = new CSVRow('cell1,cell2');

            let testError: any = {};

            try {
                row.setCellAlias(2, 'hello!');
            } catch (error) {
                testError = error;
            }

            expect(testError.name).to.equal('ApiError');
            expect(testError.message).to.equal('CSVRow - setCellAlias: Alias does not exist!');
        });

        it('should set new alias (separator - comma)', () => {
            const row = new CSVRow('cell1,cell2');

            expect(row.getCellValue(0)).to.equal('cell1');

            row.setCellAlias(0, 'alias1');

            expect(row.getCellValue('alias1')).to.equal('cell1');
        });

        it('should set new alias (separator - semicolon)', () => {
            const row = new CSVRow('cell3;cell4;cell5');

            expect(row.getCellValue(1)).to.equal('cell4');

            row.setCellAlias(1, 'alias2');

            expect(row.getCellValue('alias2')).to.equal('cell4');
        });
    });

    describe('size', () => {
        it('should return 0 if value storage is empty', () => {
            const row = new CSVRow();

            expect(row['storage'].size).to.equal(0);

            expect(row.size).to.equal(0);
        });

        it('should return size of cell storage if value storage is not empty (separator - comma)', () => {
            const row = new CSVRow('cell1,cell2');

            expect(row['storage'].size).to.equal(2);

            expect(row.size).to.equal(2);
        });

        it('should return size of cell storage if value storage is not empty (separator - semicolon)', () => {
            const row = new CSVRow('cell3;cell4;cell5');

            expect(row['storage'].size).to.equal(3);

            expect(row.size).to.equal(3);
        });
    });
});
