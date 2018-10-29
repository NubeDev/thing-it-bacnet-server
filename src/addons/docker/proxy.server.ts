import * as dgram from 'dgram';
import { AddressInfo } from 'net';
import * as DEFAULTS from './defaults';
import { Logger } from './logger';
import * as _ from 'lodash';
import { ApiError } from '../../core/errors';
import { ContainersInfo } from './containers.manager/containers.info.interface';
import { InputSocket } from '../../core/sockets';
import * as BACNet from 'tid-bacnet-logic';

export class ProxyUDPServer {
    private udpSocket: dgram.Socket;
    public logger = new Logger('Proxy UDP Server');
    constructor (
        public port: number
    ) {
        this.udpSocket = dgram.createSocket('udp4');
    }

    /**
     *start - start listening messages from thing-it-bacnet-device and forward them to docker containers ports
     *
     * @param {Map<number, any>} containersInfo - info of docker containers with simulaed ede-files
     */
    start(containersInfo: ContainersInfo[]) {
        this.logger.info('Starting proxy UDP Server...');

        this.udpSocket.on('message', (msg, rinfo) => {

            if ((rinfo.port >= DEFAULTS.DOCKER_CONTAINERS_FIRST_PORT) && (rinfo.port < DEFAULTS.DOCKER_CONTAINERS_FIRST_PORT + 1000)
                && (rinfo.address === DEFAULTS.DOCKER_CONTAINERS_ADDR)) {
                const containerInfo = containersInfo.find((info) => info.port === rinfo.port);
                let resp, bacnetMsg, output: AddressInfo;

                try {
                    resp = JSON.parse(msg.toString());
                    bacnetMsg = Buffer.from(resp.msg, 'hex');
                    output = resp.rinfo;
                    this.logger.info(`got: ${bacnetMsg.toString('hex')} from  ${containerInfo.name} running on ${rinfo.address}:${rinfo.port}`);
                    let inputSoc: InputSocket = null;

                    if (!containerInfo.deviceId) {
                        inputSoc = new InputSocket(bacnetMsg);
                        if (inputSoc.apdu.serviceChoice === BACNet.Enums.UnconfirmedServiceChoice.iAm) {
                            const serviceMessage = inputSoc.apdu.service as BACNet.Interfaces.UnconfirmedRequest.Service.IAm;
                            if (!containerInfo.deviceId) {
                            containerInfo.deviceId = serviceMessage.objId.getValue();
                            }
                        }
                    }

                    if (!containerInfo.remoteTINOutput) {
                        inputSoc = inputSoc ? inputSoc : new InputSocket(bacnetMsg);
                        if (inputSoc.apdu.serviceChoice !== BACNet.Enums.UnconfirmedServiceChoice.iAm) {
                            this.logger.info(`binding ${containerInfo.name} to the remote TIN: ${output.address}:${output.port}`);
                            containerInfo.remoteTINOutput = output;
                        }

                    }

                    this.logger.info(`sending ${bacnetMsg.toString('hex')} to remote thing-it-bacnet-device running on ${output.address}:${output.port}`);
                    this.udpSocket.send(bacnetMsg, output.port, output.address);

                } catch (error) {
                    this.logger.error(`Unable to parse message from ${containerInfo.name} as JSON, original rinfo is lost!`);
                }

            } else {
                this.logger.info(`got: ${msg.toString('hex')} from remote thing-it-bacnet-device running on ${rinfo.address}:${rinfo.port}`);
                const message = JSON.stringify({
                    msg: msg.toString('hex'),
                    rinfo: rinfo
                });
                const bindedContainerInfo = containersInfo.find((info) => {
                    if (info.remoteTINOutput) {
                        return info.remoteTINOutput.address === rinfo.address && info.remoteTINOutput.port === rinfo.port;
                    }
                    return false;
                });
                if (bindedContainerInfo) {
                    this.udpSocket.send(message, bindedContainerInfo.port, DEFAULTS.DOCKER_CONTAINERS_ADDR);
                } else {
                    const inputSoc: InputSocket = new InputSocket(msg);
                    if (inputSoc.apdu.serviceChoice === BACNet.Enums.ConfirmedServiceChoice.ReadProperty) {
                        const serviceMessage = inputSoc.apdu.service as BACNet.Interfaces.ConfirmedRequest.Service.ReadProperty;
                        const objId = serviceMessage.objId
                        if (objId.value.type === BACNet.Enums.ObjectType.Device) {
                            const targetContainer = containersInfo.find(container => objId.isEqual(container.deviceId));
                            if (targetContainer) {
                                this.logger.info(`binding ${targetContainer.name} to the remote TIN: ${rinfo.address}:${rinfo.port}`);
                                targetContainer.remoteTINOutput = _.clone(rinfo);
                                this.udpSocket.send(message, targetContainer.port, DEFAULTS.DOCKER_CONTAINERS_ADDR);
                                return;
                            }
                        }
                    }
                    for (let container of containersInfo) {
                        this.udpSocket.send(message, container.port, DEFAULTS.DOCKER_CONTAINERS_ADDR);
                    }
                }
            }
        });
        this.udpSocket.on('error', (err) => {
            this.logger.error(`UDP socket error: ${err}`);
            this.logger.error(`Closing UDP socket...`);
            this.udpSocket.close()
        });
        this.udpSocket.on('listening', () => {
            const socketInfo = this.udpSocket.address() as AddressInfo;
            this.logger.info(`listening ${socketInfo.address}:${socketInfo.port}`);
        });
        this.udpSocket.bind(this.port);
        this.logger.info('Successfully started')
    }

    stop() {
        this.udpSocket.close();
    }
}
