import * as fs from 'fs';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as Bluebird from 'bluebird';

import { CSVTable } from '../csv/table.csv';
import { CSVRow } from '../csv/row.csv';

import {
    IEDEUnit,
    IBACnetAddressInfo,
} from '../interfaces';

import {
    OffsetUtil,
} from './offset.util';

export class EDEReaderUtil {
    private csvTable: CSVTable;

    constructor (fileData: Buffer) {
        this.fromBuffer(fileData);
    }

    /**
     * fromBuffer - creates the instance of CSVTable class and parses the
     * buffer from csv file.
     *
     * @return {CSVRow}
     */
    public fromBuffer (fileData: Buffer): void {
        const csvFile = fileData.toString();
        this.csvTable = new CSVTable(csvFile);
    }

    /**
     * genHeader - generates the EDE header in the CSV format.
     *
     * @param  {IEDEHeaderOptions} opts - EDE header options
     * @return {void}
     */
    public readHeader (): void {
        const offset = new OffsetUtil(0);

        const fileType =
            this.csvTable.getRowByIndex(offset.inc());

        const projectName =
            this.csvTable.getRowByIndex(offset.inc());

        const versionOfRefFile =
            this.csvTable.getRowByIndex(offset.inc());

        const tsOfLastChange =
            this.csvTable.getRowByIndex(offset.inc());

        const authorOfLastChange =
            this.csvTable.getRowByIndex(offset.inc());

        const versionOfLayout =
            this.csvTable.getRowByIndex(offset.inc());

        const hints =
            this.csvTable.getRowByIndex(offset.inc());

        const titles =
            this.csvTable.getRowByIndex(offset.inc());
    }

    /**
     * readDataPointRow - reads the unit properties.
     *
     * @param  {number} index - row index
     * @return {IEDEUnit}
     */
    public readDataPointRow (index: number): IEDEUnit {
        const offset = new OffsetUtil(0);
        const dataPointRow = this.csvTable.getRowByIndex(index);
        // <Device Instance>_<Device Name>_<Object Name>
        const keyname =
            dataPointRow.getCellValue(offset.inc()) as string;
        // BACnet Master Device Instance
        const deviceInst =
            dataPointRow.getCellValue(offset.inc()) as number;
        // BACnet Object Name
        const objName =
            dataPointRow.getCellValue(offset.inc()) as string;
        // BACnet Object Type
        const objType =
            dataPointRow.getCellValue(offset.inc()) as number;
        // BACnet Object Instance
        const objInst =
            dataPointRow.getCellValue(offset.inc()) as number;
        // BACnet Object Description
        const description =
            dataPointRow.getCellValue(offset.inc()) as string;

        const defPresentValue =
            dataPointRow.getCellValue(offset.inc()) as number;

        const minPresentValue =
            dataPointRow.getCellValue(offset.inc()) as number;

        const maxPresentValue =
            dataPointRow.getCellValue(offset.inc()) as number;

        const commandable =
            dataPointRow.getCellValue(offset.inc()) as string;

        const supportCOV =
            dataPointRow.getCellValue(offset.inc()) as string;

        const hiLimit =
            dataPointRow.getCellValue(offset.inc()) as number;

        const liLimit =
            dataPointRow.getCellValue(offset.inc()) as number;

        const stateTextRef =
            dataPointRow.getCellValue(offset.inc()) as number;

        const unitCode =
            dataPointRow.getCellValue(offset.inc()) as number;

        const vendorAddr =
            dataPointRow.getCellValue(offset.inc()) as string;

        return {
            keyname: keyname,
            deviceInst: deviceInst,
            objName: objName,
            objType: objType,
            objInst: objInst,
            description: description,
            defPresentValue: defPresentValue,
            minPresentValue: minPresentValue,
            maxPresentValue: maxPresentValue,
            commandable: commandable,
            supportCOV: supportCOV,
            hiLimit: hiLimit,
            liLimit: liLimit,
            stateTextRef: stateTextRef,
            unitCode: unitCode,
            vendorAddr: vendorAddr,
        };
    }

    /**
     * readDataPointTable - reads all data point rows.
     *
     * @return {IEDEUnit[]}
     */
    public readDataPointTable (): IEDEUnit[] {
        const tableLen = this.csvTable.lenght;
        const offset = new OffsetUtil(8);
        const startIndex = offset.getVaule();

        const dataPointRows: IEDEUnit[] = [];
        for (let i = startIndex; i < tableLen; i++) {
            const dataPointRow = this.readDataPointRow(offset.inc());
            dataPointRows.push(dataPointRow);
        }

        return dataPointRows;
    }

}
