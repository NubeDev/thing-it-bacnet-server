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
} from '../bacnet/utils';

import {
    ConverterUtil,
} from '../utils';

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
        const keyname = dataPointRow.getCellValue(offset.inc());
        // BACnet Master Device Instance
        const deviceInst = dataPointRow.getCellValue(offset.inc());
        // BACnet Object Name
        const objName = dataPointRow.getCellValue(offset.inc());
        // BACnet Object Type
        const objType = dataPointRow.getCellValue(offset.inc());
        // BACnet Object Instance
        const objInst = dataPointRow.getCellValue(offset.inc());
        // BACnet Object Description
        const description = dataPointRow.getCellValue(offset.inc());
        // BACnet default value for "Present Value" property
        const defPresentValue = dataPointRow.getCellValue(offset.inc());
        // BACnet min value for "Present Value" property
        const minPresentValue = dataPointRow.getCellValue(offset.inc());
        // BACnet max value for "Present Value" property
        const maxPresentValue = dataPointRow.getCellValue(offset.inc());
        // BACnet object has or not commandable properties
        const commandable = dataPointRow.getCellValue(offset.inc());
        // BACnet object support COV notification
        const supportCOV = dataPointRow.getCellValue(offset.inc());

        const hiLimit = dataPointRow.getCellValue(offset.inc());

        const liLimit = dataPointRow.getCellValue(offset.inc());
        // ID in the "State Text" array (property)
        const stateTextRef = dataPointRow.getCellValue(offset.inc());
        // Measurement unit of the "Present Value" property
        const unitCode = dataPointRow.getCellValue(offset.inc());

        const vendorAddr = dataPointRow.getCellValue(offset.inc());
        // Type of the custom unit
        const custUnitType = dataPointRow.getCellValue(offset.inc());
        // ID of the custom unit
        const custUnitId = dataPointRow.getCellValue(offset.inc());
        // Function of the BACnet object in custom unit
        const custUnitFn = dataPointRow.getCellValue(offset.inc());
        // Max value for simulation logic
        const custUnitMax = dataPointRow.getCellValue(offset.inc());
        // Min value for simulation logic
        const custUnitMin = dataPointRow.getCellValue(offset.inc());
        // Frequency of changes of the value for simulation logic
        const custUnitFreq = dataPointRow.getCellValue(offset.inc());

        return {
            keyname: keyname,
            deviceInst: ConverterUtil.stringToNumber(deviceInst),
            objName: objName,
            objType: ConverterUtil.stringToNumber(objType),
            objInst: ConverterUtil.stringToNumber(objInst),
            description: description,
            defPresentValue: ConverterUtil.stringToNumber(defPresentValue),
            minPresentValue: ConverterUtil.stringToNumber(minPresentValue),
            maxPresentValue: ConverterUtil.stringToNumber(maxPresentValue),
            commandable: commandable,
            supportCOV: supportCOV,
            hiLimit: ConverterUtil.stringToNumber(hiLimit),
            liLimit: ConverterUtil.stringToNumber(liLimit),
            stateTextRef: ConverterUtil.stringToNumber(stateTextRef),
            unitCode: ConverterUtil.stringToNumber(unitCode),
            vendorAddr: vendorAddr,

            custUnitType: custUnitType,
            custUnitId: ConverterUtil.stringToNumber(custUnitId),
            custUnitFn: custUnitFn,
            custUnitMax: ConverterUtil.stringToNumber(custUnitMax),
            custUnitMin: ConverterUtil.stringToNumber(custUnitMin),
            custUnitFreq: ConverterUtil.stringToNumber(custUnitFreq),
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
