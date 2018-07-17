import * as Bluebird from 'bluebird';

// import {
//     BACnetPropertyId,
// } from '../core/bacnet/enums';

import { InputSocket, OutputSocket, ServiceSocket } from '../core/sockets';

import { UnitStorageManager } from '../managers/unit-storage.manager';

//import { unconfirmedReqService, simpleACKService } from '../core/bacnet/services';

import * as BACNet from 'tid-bacnet-logic';

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
        const devObjId = device.storage.getProperty(BACNet.Enums.PropertyId.objectIdentifier).payload as BACNet.Types.BACnetObjectId;
        const vendorId = device.storage.getProperty(BACNet.Enums.PropertyId.vendorIdentifier).payload as BACNet.Types.BACnetUnsignedInteger;

        const msgIAm = BACNet.Services.UnconfirmedReqService.iAm({
            objId: devObjId,
            vendorId: vendorId,
        });
        outputSoc.send(msgIAm, `Unconfirmed Request - iAm`);

        return Bluebird.resolve();
    }
}

export const unitUnconfirmedReqService: UnitUnconfirmedReqService = new UnitUnconfirmedReqService();
