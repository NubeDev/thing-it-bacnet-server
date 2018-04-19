import * as _ from 'lodash';

import { ApiError } from '../errors';

export const CSVCellSeparator = ';';

export class CSVRow {
    private aliases: Map<string, number>;
    private cells: Array<number|string>;

    constructor (strRow: string = '') {
        this.aliases = new Map();
        this.fromString(strRow);
    }

    /**
     * destroy - destroys the internal buffers.
     *
     * @return {void}
     */
    public destroy (): void {
        this.aliases.clear();
        this.aliases = null;
        this.cells = null;
    }

    /**
     * setCellAlias - sets the alias to the specific cell.
     *
     * @param  {number} cellNumber - cell ID
     * @param  {string} cellAlias - cell alias
     * @return {CSVRow}
     */
    public setCellAlias (cellNumber: number, cellAlias: string): CSVRow {
        if (this.aliases.has(cellAlias)) {
            throw new ApiError(`CSVRow - setAlias: Alias ${cellAlias} is already exist!`);
        }

        this.aliases.set(cellAlias, cellNumber);
        return this;
    }

    /**
     * setCellValue - sets the values in a cell by the cell ID or cell alias.
     *
     * @param  {number|string} cellInst - cell ID of cell alias
     * @param  {number|string} cellValue - new valuse of cell
     * @return {CSVRow}
     */
    public setCellValue (cellInst: number|string, cellValue: number|string): CSVRow {
        let cellNumber: number = _.isString(cellInst)
            ? this.aliases.get(cellInst)
            : cellInst;

        if (!_.isNumber(cellNumber) || !_.isFinite(cellNumber)) {
            throw new ApiError(`CSVRow - setValue: Cell "${cellInst}" is not exist!`);
        }

        const newCellValue: number|string = _.isString(cellValue)
            ? this.escapeString(cellValue)
            : cellValue;

        this.cells[cellNumber] = newCellValue;
        return this;
    }

    /**
     * getCellValue - returns the values by cell ID or cell alias. If cell is empty
     * method will return the empty string value.
     *
     * @param  {number|string} cellInst - cell ID of cell alias
     * @return {number|string}
     */
    public getCellValue (cellInst: number|string): number|string {
        let cellNumber: number = _.isString(cellInst)
            ? this.aliases.get(cellInst)
            : cellInst;

        const cellValue = this.cells[cellNumber];
        return _.isNil(cellValue) ? '' : cellValue;
    }

    /**
     * lenght - returns the lenght of the row.
     *
     * @return {number}
     */
    public get lenght (): number {
        return this.cells.length;
    }

    /**
     * fromString - parses the "Row" string (csv format) and creates an array
     * of "value"s from parsed data.
     *
     * @param  {string} strRow - string in csv format (row)
     * @return {void}
     */
    public fromString (strRow: string): void {
        if (!_.isString(strRow)) {
            throw new ApiError(`CSVRow - fromString: Input string must have string type!`);
        }

        if (!strRow) {
            this.cells = [];
            return;
        }

        const cells = strRow.split(CSVCellSeparator);

        const formatedCells = _.map(cells, (cellStr) => {
            const cellNum = parseFloat(cellStr);
            return _.isFinite(cellNum) ? cellNum : cellStr.trim();
        });

        this.cells = formatedCells;
    }

    /**
     * toString - returns the string representation (csv format) of the row.
     *
     * @param  {number} numOfCells - number of cells
     * @return {string}
     */
    public toString (numOfCells: number): string {
        const rowArray: Array<number|string> = new Array(numOfCells).fill('');

        for (const arrIndex in this.cells) {
            if (!this.cells.hasOwnProperty(arrIndex)) { continue; }
            rowArray[arrIndex] = this.cells[arrIndex];
        }

        return rowArray.join(CSVCellSeparator);
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
