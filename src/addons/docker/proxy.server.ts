import * as dgram from 'dgram';
import { AddressInfo } from 'net';
import * as DEFAULTS from './defaults';
import { initLogger } from './logger';

export class ProxyUDPServer {
    private udpSocket: dgram.Socket;
    public logger: any;
    constructor (
        public port: number = DEFAULTS.THIS_PORT
    ) {
        this.udpSocket = dgram.createSocket('udp4');
        this.logger = initLogger('Proxy UDP Server');
    }

    /**
     *start - start listening messages from thing-it-bacnet-device and forward them to docker containers ports
     *
     * @param {string} [outputAddr=DEFAULTS.OUTPUT_ADDR] - address of remote thing-it-bacnet-device to connect
     * @param {number} [outputPort=DEFAULTS.OUTPUT_PORT] - port of the remote thing-it-bacnet-device to connect
     * @param {number[]} containersPorts - ports of docker containers with simulaed ede-files
     */
    start(outputAddr: string = DEFAULTS.OUTPUT_ADDR, outputPort: number = DEFAULTS.OUTPUT_PORT, containersPorts: number[]) {
        this.logger.info('Starting proxy UDP Server...')
        this.udpSocket.on('message', (msg, rinfo) => {

            if (rinfo.port >= DEFAULTS.DOCKER_CONTAINERS_FIRST_PORT && rinfo.port < DEFAULTS.DOCKER_CONTAINERS_FIRST_PORT + 1000
                && rinfo.address === DEFAULTS.DOCKER_CONTAINERS_ADDR) {
                this.logger.info(`got: ${msg.toString('hex')} from ${rinfo.address}:${rinfo.port}`);
                this.udpSocket.send(msg, outputPort, outputAddr)
            } else  if (rinfo.port === outputPort && rinfo.address === outputAddr) {
                this.logger.info(`got: ${msg.toString('hex')} from ${rinfo.address}:${rinfo.port}`);
                containersPorts.forEach((port) => {
                    this.udpSocket.send(msg, port, DEFAULTS.DOCKER_CONTAINERS_ADDR)
                })
            }
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
