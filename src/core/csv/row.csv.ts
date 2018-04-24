import * as _ from 'lodash';

import { ApiError } from '../errors';

import { AliasMap } from '../alias';

export const CSVCellSeparatorMain = ';';
export const CSVCellSeparators = [ CSVCellSeparatorMain, ',' ];

export class CSVRow {
    public readonly className: string = 'CSVRow';
    private storage: AliasMap<string>;

    constructor (strRow: string = '') {
        this.storage = new AliasMap();
        this.fromString(strRow);
    }

    /**
     * destroy - destroys the internal buffers.
     *
     * @return {void}
     */
    public destroy (): void {
        this.storage.destroy();
        this.storage = null;
    }

    /**
     * setCellAlias - sets the new alias by cell alias.
     *
     * @param  {number} cellAlias - cell alias
     * @param  {string} newCellAlias - new cell alias
     * @return {CSVRow}
     */
    public setCellAlias (cellAlias: number|string, newCellAlias: string): CSVRow {
        const alias = this.storage.getAlias(`${cellAlias}`);

        if (_.isNil(alias)) {
            throw new ApiError(`${this.className} - setCellAlias: Alias does not exist!`);
        }

        alias.add(newCellAlias);

        return this;
    }

    /**
     * setCellValue - sets the values in a cell by the cell alias.
     *
     * @param  {number|string} cellAlias - cell alias
     * @param  {string} cellValue - new value of cell
     * @return {CSVRow}
     */
    public setCellValue (cellAlias: number|string, cellValue: string): CSVRow {
        if (!this.storage.has(`${cellAlias}`)) {
            throw new ApiError(`${this.className} - setCellValue: Alias does not exist!`);
        }

        const newCellValue: string = this.escapeString(cellValue);

        this.storage.set(`${cellAlias}`, newCellValue);
        return this;
    }

    /**
     * getCellValue - returns the values by cell ID or cell alias. If cell is empty
     * method will return the empty string value.
     *
     * @param  {number|string} cellAlias - cell alias
     * @return {number|string}
     */
    public getCellValue (cellAlias: number|string): string {
        const cellValue = this.storage.get(`${cellAlias}`);
        return _.isNil(cellValue) ? '' : cellValue;
    }

    /**
     * suze - returns the size of the cell storage.
     *
     * @type {number}
     */
    public get size (): number {
        return this.storage.size;
    }

    /**
     * fromString - parses the CSV row and inits the internal storage of CSV cells.
     *
     * @param  {string} strRow - CSV row
     * @return {void}
     */
    public fromString (strRow: string) {
        const rgxValid1 = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
        const rgxValid2 = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^;'"\s\\]*(?:\s+[^;'"\s\\]+)*)\s*(?:;\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^;'"\s\\]*(?:\s+[^;'"\s\\]+)*)\s*)*$/;

        if (!rgxValid1.test(strRow) && !rgxValid2.test(strRow)) {
            throw new ApiError('CSVRow - fromString: Input string must have valid format');
        }

        const rgxValue1 = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
        const cells1 = this.CSVtoArray(strRow, rgxValue1);

        const rgxValue2 = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^;'"\s\\]*(?:\s+[^;'"\s\\]+)*))\s*(?:;|$)/g;
        const cells2 = this.CSVtoArray(strRow, rgxValue2);

        const cells = cells1.length > cells2.length ? cells1 : cells2;

        _.map(cells, (value, index) => {
            this.storage.set(`${index}`, value);
        });
    }

    /**
     * CSVtoArray - parses the CSV row by specific CSV regular expression and
     * creates an array of CSV cells from result of parsing.
     *
     * @param  {string} strRow - CSV row
     * @param  {RegExp} rgxValue - CSV regular expression
     * @return {string[]} - array of CSV cells
     */
    private CSVtoArray (strRow: string, rgxValue: RegExp): string[] {
        const cells = [];
        strRow.replace(rgxValue, (m0, m1, m2, m3) => {
            if (m1) {
                const value = m1.replace(/\\'/g, `'`);
                cells.push(value);
            } else if (m2) {
                cells.push(m2.replace(/\\"/g, `"`));
            } else {
                cells.push(m3);
            }
            return '';
        });

        // Handle special case of empty last value.
        if (/,\s*$/.test(strRow)) {
            cells.push('');
        };

        return cells;
    }

    /**
     * toString - returns the string representation (csv format) of the row.
     *
     * @param  {number} numOfCells - number of cells
     * @return {string}
     */
    public toString (numOfCells: number): string {
        const rowArray: Array<number|string> = new Array(numOfCells).fill('');

        for (let i = 0; i < numOfCells; i++) {
            const cellValue = this.storage.get(`${i}`);

            if (_.isNil(cellValue)) {
                continue;
            }

            rowArray[i] = cellValue;
        }

        return rowArray.join(CSVCellSeparatorMain);
    }

    /**
     * escapeString - returns the escaped string in accordance with csv rules.
     *
     * @param  {string} str - unescaped string
     * @return {string}
     */
    public escapeString (str: string): string {
        const escapedString = _.replace(str, /"/g, '""');
        return /(;|,|\n|\")/.test(escapedString)
            ? `"${escapedString}"` : escapedString;
    }
}
