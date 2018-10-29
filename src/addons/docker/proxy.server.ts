import * as dgram from 'dgram';
import { AddressInfo } from 'net';
import * as DEFAULTS from './defaults';
import { Logger } from './logger';
import * as _ from 'lodash';
import { ApiError } from '../../core/errors';
import { ContainersInfo } from './containers.manager/containers.info.interface';
import { InputSocket } from '../../core/sockets';
import { Enums } from 'tid-bacnet-logic';

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
        let outputPortDefault: number = null;
        if (_.isEmpty(portMappings)) {
            this.logger.warn('portMappings are not specified! Using --outputPort value');
            if (outputPort) {
                outputPortDefault = outputPort;
                this.logger.warn(`All messages will be sent to outputPort ${outputAddr}:${outputPort}`)
            } else {
                this.logger.warn(`Output port is not specified! all messages will be sent to 47808`);
                outputPortDefault = 47808;
            }
        }
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
                    this.logger.info(`sending ${bacnetMsg.toString('hex')} to remote thing-it-bacnet-device running on ${output.address}:${output.port}`);

                    if (!containerInfo.remoteTINOutput) {
                        const inputSoc: InputSocket = new InputSocket(bacnetMsg);
                        if (inputSoc.apdu.serviceChoice !== Enums.UnconfirmedServiceChoice.iAm) {
                            this.logger.info(`binding ${containerInfo.name} to the remote TIN: ${output}`)
                            containerInfo.remoteTINOutput = output;
                        }
                    }

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
