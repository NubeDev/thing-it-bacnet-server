import * as dgram from 'dgram';
import { AddressInfo } from 'net';
import * as DEFAULTS from './defaults';
import { Logger } from './logger';
import { ApiError } from '../../core/errors';
import { ContainersInfo } from './containers.manager/containers.info.interface';

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
    start(outputAddr: string, outputPort: number, containersInfo: ContainersInfo[]) {
        this.logger.info('Starting proxy UDP Server...');
        this.udpSocket.on('message', (msg, rinfo) => {

            if ((rinfo.port >= DEFAULTS.DOCKER_CONTAINERS_FIRST_PORT) && (rinfo.port < DEFAULTS.DOCKER_CONTAINERS_FIRST_PORT + 1000)
                && (rinfo.address === DEFAULTS.DOCKER_CONTAINERS_ADDR)) {
                const containerName = containersInfo.find((container) => container.port === rinfo.port).name;
                let resp, bacnetMsg, output;
                try {
                    resp = JSON.parse(msg.toString());
                    bacnetMsg = Buffer.from(resp.msg, 'hex');
                    output = resp.rinfo;

                } catch (error) {
                    throw new ApiError(`Unable to parse message from ${containerName} as JSON, treating as BACNet message...`);
                    bacnetMsg = msg;
                    output = {
                        address: outputAddr,
                        port: outputPort
                    }
                }

                this.logger.info(`got: ${bacnetMsg.toString('hex')} from  ${containerName} running on ${rinfo.address}:${rinfo.port}`);
                this.logger.info(`sending ${bacnetMsg.toString('hex')} to remote thing-it-bacnet-device running on ${output.address}:${output.port}`);

                this.udpSocket.send(bacnetMsg, output.port, output.address)

            } else {
                this.logger.info(`got: ${msg.toString('hex')} from remote thing-it-bacnet-device running on ${rinfo.address}:${rinfo.port}`);
                for (let container of containersInfo) {
                    const message = JSON.stringify({
                        msg: msg.toString('hex'),
                        rinfo: rinfo
                    });
                    console.log(message);
                    this.udpSocket.send(message, container.port, DEFAULTS.DOCKER_CONTAINERS_ADDR);
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
