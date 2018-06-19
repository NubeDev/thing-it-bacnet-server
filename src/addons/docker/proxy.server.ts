import * as dgram from 'dgram';
import { AddressInfo } from 'net';
import * as DEFAULTS from './defaults';

export class ProxyUDPServer {
    private udpSocket: dgram.Socket;
    constructor (
        public port: number = DEFAULTS.THIS_PORT,
        public logger: any
    ) {
        this.udpSocket = dgram.createSocket('udp4');
    }

    /**
     *start - start listening messages from thing-it-bacnet-device and forward them to docker containers ports
     *
     * @param {string} [outputAddr=DEFAULTS.OUTPUT_ADDR] - address of remote thing-it-bacnet-device to connect
     * @param {number} [outputPort=DEFAULTS.OUTPUT_PORT] - port of the remote thing-it-bacnet-device to connect
     * @param {number[]} containersPorts - ports of docker containers with simulaed ede-files
     */
    start(outputAddr: string = DEFAULTS.OUTPUT_ADDR, outputPort: number = DEFAULTS.OUTPUT_PORT, containersInfo: Map<number, any>) {
        this.logger.info('[Proxy UDP Server]: Starting proxy UDP Server...');
        this.udpSocket.on('message', (msg, rinfo) => {

            if (rinfo.port >= DEFAULTS.DOCKER_CONTAINERS_FIRST_PORT && rinfo.port < DEFAULTS.DOCKER_CONTAINERS_FIRST_PORT + 1000
                && rinfo.address === DEFAULTS.DOCKER_CONTAINERS_ADDR) {
                this.logger.info(`[Proxy UDP Server]: got: ${msg.toString('hex')} from  ${containersInfo.get(rinfo.port).name} running on ${rinfo.address}:${rinfo.port}`);
                this.logger.info(`[Proxy UDP Server]: sending ${msg.toString('hex')} to remote thing-it-bacnet-device running on ${outputAddr}:${outputPort}`)
                this.udpSocket.send(msg, outputPort, outputAddr)
            } else  if (rinfo.port === outputPort && rinfo.address === outputAddr) {
                this.logger.info(`[Proxy UDP Server]: got: ${msg.toString('hex')} from remote thing-it-bacnet-device running on ${rinfo.address}:${rinfo.port}`);
                containersInfo.forEach((info, port) => {
                    this.logger.info(`[Proxy UDP Server]: sending ${msg.toString('hex')} to docker container ${info.name} running on ${DEFAULTS.DOCKER_CONTAINERS_ADDR}:${port}`)
                    this.udpSocket.send(msg, port, DEFAULTS.DOCKER_CONTAINERS_ADDR)
                })
            }
        });
        this.udpSocket.on('error', (err) => {
            this.logger.error(`[Proxy UDP Server]: UDP socket error: ${err}`);
            this.logger.error(`[Proxy UDP Server]: Closing UDP socket...`);
            this.udpSocket.close()
        });
        this.udpSocket.on('listening', () => {
            const address = this.udpSocket.address() as AddressInfo;
            this.logger.info(`[Proxy UDP Server]: listening ${address.address}:${address.port}`);
        });
        this.udpSocket.bind(this.port);
        this.logger.info('[Proxy UDP Server]: Successfully started')
    }

    stop() {
        this.udpSocket.close();
    }
}
