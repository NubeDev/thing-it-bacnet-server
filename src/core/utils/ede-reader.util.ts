import * as fs from 'fs';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as Bluebird from 'bluebird';

import { CSVTable } from '../csv/table.csv';
import { CSVRow } from '../csv/row.csv';

import {
    IEDEUnitProps,
    IEDEUnit,
    IBACnetAddressInfo,
} from '../interfaces';

import {
    OffsetUtil,
} from './offset.util';

export class EDEReaderUtil {
    private csvTable: CSVTable;
    private offset: OffsetUtil;

    constructor (fileData: Buffer) {
        this.offset = new OffsetUtil(0);
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
     * getRowByIndex - returns the next instance of CSVRow class.
     *
     * @return {CSVRow}
     */
    private getRowByIndex (): CSVRow {
        const index = this.offset.inc();
        return this.csvTable.getRowByIndex(index);
    }

    /**
     * genHeader - generates the EDE header in the CSV format.
     *
     * @param  {IEDEHeaderOptions} opts - EDE header options
     * @return {void}
     */
    public readHeader (): void {
        const fileType = this.getRowByIndex();

        const projectName = this.getRowByIndex();

        const versionOfRefFile = this.getRowByIndex();

        const tsOfLastChange = this.getRowByIndex();

        const authorOfLastChange = this.getRowByIndex();

        const versionOfLayout = this.getRowByIndex();

        const hints = this.getRowByIndex();

        const titles = this.getRowByIndex();
    }

    /**
     * genDataPointRow - creates the CSVRow instance and sets aliases for row cells.
     *
     * @return {IEDEUnitProps}
     */
    public readDataPointRow (): IEDEUnitProps {
        const offset = new OffsetUtil(0);
        const dataPointRow = this.getRowByIndex();
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
}
