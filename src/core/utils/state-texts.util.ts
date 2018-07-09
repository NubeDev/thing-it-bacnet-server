import * as fs from 'fs';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as Bluebird from 'bluebird';

import { CSVTable } from '../csv/table.csv';
import { CSVRow } from '../csv/row.csv';

import {
    IStateTextsUnit,
} from '../interfaces';

import {
    OffsetUtil,
} from '../bacnet/utils';

import {
    ConverterUtil,
} from '../utils';

export class StateTextReader {
    private csvTable: CSVTable;

    constructor (fileData: Buffer) {
        this.fromBuffer(fileData);
    }

    /**
     * fromBuffer - creates the instance of CSVTable class and parses the
     * buffer from csv file.
     *
     * @return {CSVTable}
     */
    public fromBuffer (fileData: Buffer): void {
        const csvFile = fileData.toString();
        this.csvTable = new CSVTable(csvFile);
    }

    /**
     * readDataPointRow - reads the unit properties.
     *
     * @param  {number} index - row index
     * @return {IStateTextsUnit}
     */
    public readDataPointRow (index: number): IStateTextsUnit {
        const offset = new OffsetUtil(0);
        const dataPointRow = this.csvTable.getRowByIndex(index);
        // <Reference Number>
        const referenceNumber = dataPointRow.getCellValue(offset.inc());
        // Getting State text array
        const stateTextsArray = [];
        for (let i = 0; i < dataPointRow.size; i++) {
            const text = dataPointRow.getCellValue(offset.inc());
            stateTextsArray.push(text)
        }
        const stateTextsUnit: IStateTextsUnit = {
            referenceNumber: ConverterUtil.stringToNumber(referenceNumber),
            stateTextsArray: stateTextsArray
        };
        if (stateTextsArray.length === 2) {
            // Inactive text for Binary Units
            stateTextsUnit.inactiveText = stateTextsArray[0];
            // Active text for Binary Units
            stateTextsUnit.activeText = stateTextsArray[1];
        }
        return stateTextsUnit
    }

    /**
     * readDataPointTable - reads all data point rows.
     *
     * @return {IStateTextsUnit[]}
     */
    public readDataPointTable (): IStateTextsUnit[] {
        const tableLen = this.csvTable.lenght;
        const offset = new OffsetUtil(2);
        const startIndex = offset.getVaule();

        const dataPointRows: IStateTextsUnit[] = [];
        for (let i = startIndex; i < tableLen; i++) {
            const dataPointRow = this.readDataPointRow(offset.inc());
            dataPointRows.push(dataPointRow);
        }

        return dataPointRows;
    }

}
