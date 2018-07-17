import * as Bluebird from 'bluebird';
import { timer as RxTimer } from 'rxjs/observable/timer';
import * as _ from 'lodash';

// import {
//     BACNet.Enums.PropertyId,
// } from '../core/enums';

// import {
//     ILayerConfirmedReq,
//     ILayerConfirmedReqService,
//     ILayerConfirmedReqServiceReadProperty,
//     ILayerConfirmedReqServiceSubscribeCOV,
//     ILayerConfirmedReqServiceWriteProperty,
// } from '../core/bacnet/interfaces';

// import {
//     BACnetObjectId, BACnetUnsignedInteger,
// } from '../core/bacnet/types';

import { InputSocket, OutputSocket, ServiceSocket } from '../core/sockets';

import { UnitStorageManager } from '../managers/unit-storage.manager';
import { SubscriptionManager } from '../managers/subscription.manager';

import * as BACNet from 'tid-bacnet-logic';

export class UnitConfirmedReqService {
    private subManager: SubscriptionManager;
    constructor() {
        this.subManager = new SubscriptionManager();
        this.subManager.initManager();
    }

    /**
     * readProperty - handles the "readProperty" confirmed request.
     *
     * @param  {RequestSocket} req - request object (socket)
     * @param  {ResponseSocket} resp - response object (socket)
     * @return {Bluebird<any>}
     */
    public readProperty (inputSoc: InputSocket, outputSoc: OutputSocket,
            serviceSocket: ServiceSocket): Bluebird<any> {
        const apduMessage = inputSoc.apdu as BACNet.Interfaces.ConfirmedRequest.Read.Layer;
        const apduService = apduMessage.service as BACNet.Interfaces.ConfirmedRequest.Service.ReadProperty;

        const invokeId = apduMessage.invokeId;

        // Get object identifier
        const unitObjId = apduService.objId;

        // Get property identifier
        const propId = apduService.prop.id;
        const propIdValue = propId.getValue();

        // Get BACnet property (for BACnet object)
        const unitStorage: UnitStorageManager = serviceSocket.getService('unitStorage');
        const unitProp = unitStorage.getUnitProperty(unitObjId, propIdValue);

        const msgReadProperty = BACNet.Services.ComplexACKService.readProperty({
            invokeId: invokeId,
            objId: unitObjId,
            prop: unitProp,
        });
        outputSoc.send(msgReadProperty, `Complex ACK - readProperty`);

        return Bluebird.resolve();
    }

    /**
     * subscribeCOV - handles the "subscribeCOV" confirmed request.
     * Method sends the "subscribeCOV" simple ack response and subscribe on the
     * COV notification for specific BACnet object (unit).
     *
     * @param  {RequestSocket} req - request object (socket)
     * @param  {ResponseSocket} resp - response object (socket)
     * @return {Bluebird<any>}
     */
    public subscribeCOV (inputSoc: InputSocket, outputSoc: OutputSocket,
            serviceSocket: ServiceSocket): Bluebird<any> {
        const apduMessage = inputSoc.apdu as BACNet.Interfaces.ConfirmedRequest.Read.Layer;
        const apduService = apduMessage.service as BACNet.Interfaces.ConfirmedRequest.Service.SubscribeCOV;
        const unitStorage: UnitStorageManager = serviceSocket.getService('unitStorage');

        // Get subscription lifetime
        const lifetime = apduService.lifetime;
        // Get issue Confirmation Notification flag
        const issConfNotif = apduService.issConfNotif;

        if (_.isNil(lifetime) && _.isNil(issConfNotif)) {
            return this.unsubscribeCOV(inputSoc, outputSoc, serviceSocket);
        }

        // --- Sends response "subscribeCOV"

        // Get invoke ID
        const invokeId = apduMessage.invokeId;

        const msgSubscribeCOV = BACNet.Services.SimpleACKService.subscribeCOV({
            invokeId: invokeId
        });
        outputSoc.send(msgSubscribeCOV, `Simple ACK - subscribeCOV`);

        // --- Sends response "covNotification"

        // Get process ID
        const subProcessId = apduService.subProcessId;

        // Get unit Object identifier
        const unitObjId = apduService.objId;

        // Get device Object identifier
        const device = unitStorage.getDevice();
        const devObjIdProp = device.storage.getProperty(BACNet.Enums.PropertyId.objectIdentifier);
        const devObjId = devObjIdProp.payload as BACNet.Types.BACnetObjectId;

        let COVSubscription = unitStorage
            .subscribeToUnit(unitObjId)
            .subscribe((reportedProps) => {
                const msgCovNotification = BACNet.Services.UnconfirmedReqService.covNotification({
                    subProcessId: subProcessId,
                    devId: devObjId,
                    objId: unitObjId,
                    listOfValues: reportedProps,
                });
                outputSoc.send(msgCovNotification, `Unconfirmed Request - covNotification`);
            });
        const subId = this.getSubId(unitObjId, subProcessId);
        this.subManager.add(subId, COVSubscription);

        if (lifetime.value > 0) {
            RxTimer(lifetime.value).subscribe(() => {
                COVSubscription.unsubscribe();
            })
        }

        return Bluebird.resolve();
    }

    private getSubId(objId: BACNet.Types.BACnetObjectId, subProcessId: BACNet.Types.BACnetUnsignedInteger) {
        return `${objId.value.type}:${objId.value.instance}:${subProcessId.value}`;
    }

    /**
     * unsubscribeCOV - handles the "subscribeCOV" cancelation confirmed request .
     * Method unsubscribes from the COV notification for specific BACnet object (unit)
     * and sends the "subscribeCOV" simple ack response.
     *
     * @param  {RequestSocket} req - request object (socket)
     * @param  {ResponseSocket} resp - response object (socket)
     * @return {Bluebird<any>}
     */
    public unsubscribeCOV (inputSoc: InputSocket, outputSoc: OutputSocket,
         serviceSocket: ServiceSocket): Bluebird<any> {
    const apduMessage = inputSoc.apdu as BACNet.Interfaces.ConfirmedRequest.Read.Layer;
    const apduService = apduMessage.service as BACNet.Interfaces.ConfirmedRequest.Service.SubscribeCOV;
    // const unitStorage: UnitStorageManager = serviceSocket.getService('unitStorage');
    // Get process ID
    const subProcessId = apduService.subProcessId;

    // Get unit Object identifier
    const unitObjId = apduService.objId;

    const subId = this.getSubId(unitObjId, subProcessId);

    this.subManager.get(subId).unsubscribe();
    this.subManager.delete(subId);

    return Bluebird.resolve();
}

    /**
     * writeProperty - handles the "writeProperty" confirmed request.
     * Method sends the "writeProperty" simple ack response.
     *
     * @param  {RequestSocket} req - request object (socket)
     * @param  {ResponseSocket} resp - response object (socket)
     * @return {Bluebird<any>}
     */
    public writeProperty (inputSoc: InputSocket, outputSoc: OutputSocket,
            serviceSocket: ServiceSocket): Bluebird<any> {
        const apduMessage = inputSoc.apdu as BACNet.Interfaces.ConfirmedRequest.Read.Layer;
        const apduService = apduMessage.service as BACNet.Interfaces.ConfirmedRequest.Service.WriteProperty;
        const invokeId = apduMessage.invokeId;

        // Get unit Object identifier
        const objId = apduService.objId;

        // Get property ID
        const propId = apduService.prop.id;

        // Get property value
        const propValues = apduService.prop.values;
        const propValue = propValues[0];

        // Get priority of the property
        let priorityValue: number;
        try {
            const priority = apduService.prop.priority;
            priorityValue = priority.getValue();
        } catch (error) {
        }

        const unitStorage: UnitStorageManager = serviceSocket.getService('unitStorage');
        unitStorage.setUnitProperty(objId, {
            id: propId.value,
            payload: propValue ,
            priority: priorityValue,
        });

        const msgWriteProperty = BACNet.Services.SimpleACKService.writeProperty({
            invokeId: invokeId,
        });
        outputSoc.send(msgWriteProperty, `Simple ACK - writeProperty`);

        return Bluebird.resolve();
    }
}

export const unitConfirmedReqService: UnitConfirmedReqService = new UnitConfirmedReqService();
