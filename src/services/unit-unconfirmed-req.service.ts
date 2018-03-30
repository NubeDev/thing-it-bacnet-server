import * as Bluebird from 'bluebird';

import {
    BACnetServiceTypes,
    BLVCFunction,
    BACnetPropIds,
} from '../core/enums';

import { complexACKPDU, simpleACKPDU } from '../core/layers/apdus';
import { blvc, npdu } from '../core/layers';

import { BACnetWriterUtil } from '../core/utils';

import {
    IBACnetTypeObjectId,
    IBACnetTypeUnsignedInt,
} from '../core/interfaces';

import { InputSocket, OutputSocket, ServiceSocket } from '../core/sockets';

import { UnitStorageManager } from '../managers/unit-storage.manager';

import { unconfirmedReqService, simpleACKService } from './bacnet';

export class UnitUnconfirmedReqService {
    /**
     * whoIs - handles the "whoIs" request and sends a "iAm" response.
     *
     * @param  {RequestSocket} req - request object (socket)
     * @param  {ResponseSocket} resp - response object (socket)
     * @return {Bluebird<any>}
     */
    public whoIs (inputSoc: InputSocket, outputSoc: OutputSocket,
            serviceSocket: ServiceSocket): Bluebird<any> {
        const unitStorage: UnitStorageManager = serviceSocket.getService('unitStorage');

        const device = unitStorage.getDevice();
        const devObjId = device.getProperty(BACnetPropIds.objectIdentifier);
        const vendorId = device.getProperty(BACnetPropIds.vendorIdentifier);

        unconfirmedReqService.iAm({
            objId: devObjId,
            vendorId: vendorId,
        }, outputSoc);

        return Bluebird.resolve();
    }
}

export const unitUnconfirmedReqService: UnitUnconfirmedReqService = new UnitUnconfirmedReqService();
