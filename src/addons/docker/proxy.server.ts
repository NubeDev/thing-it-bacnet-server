import * as dgram from 'dgram';
import { AddressInfo } from 'net';
import * as DEFAULTS from './defaults';
import { Logger } from './logger';
import { portMappings } from './docker.proxy.config';
import * as _ from 'lodash';

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
     * @param {string} [outputAdd] - address of remote thing-it-bacnet-device to connect
     * @param {number} [outputPort=DEFAULTS.OUTPUT_PORT] - port of the remote thing-it-bacnet-device to connect
     * @param {Map<number, any>} containersInfo - info of docker containers with simulaed ede-files
     */
    start(outputAddr: string, outputPort: number, containersInfo: Map<number, any>) {
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
                const containerName = containersInfo.get(rinfo.port).name;
                const port = _.get(portMappings, containerName, outputPortDefault);
                this.logger.info(`got: ${msg.toString('hex')} from  ${containerName} running on ${rinfo.address}:${rinfo.port}`);
                this.logger.info(`sending ${msg.toString('hex')} to remote thing-it-bacnet-device running on ${outputAddr}:${port}`);

                this.udpSocket.send(msg, port, outputAddr)

            } else {
                for (const name in portMappings) {
                    if (portMappings[name] === rinfo.port) {
                        this.logger.info(`got: ${msg.toString('hex')} from remote thing-it-bacnet-device running on ${rinfo.address}:${rinfo.port}`);
                        const info = Array.from(containersInfo.values()).find(item => item.name === name);
                        this.logger.info(`sending ${msg.toString('hex')} to docker container ${info.name} running on ${DEFAULTS.DOCKER_CONTAINERS_ADDR}:${info.port}`)
                        this.udpSocket.send(msg, info.port, DEFAULTS.DOCKER_CONTAINERS_ADDR);
                        break;
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
            const address = this.udpSocket.address() as AddressInfo;
            this.logger.info(`listening ${address.address}:${address.port}`);
        });
        this.udpSocket.bind(this.port);
        this.logger.info('Successfully started')
    }

    stop() {
        this.udpSocket.close();
    }
}
