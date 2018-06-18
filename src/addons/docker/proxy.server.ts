import * as dgram from 'dgram';
import { AddressInfo } from 'net';
import * as DEFAULTS from './defaults';

export class ProxyUDPServer {
    private udpSocket: dgram.Socket;
    constructor (
        public port: number = DEFAULTS.THIS_PORT
    ) {
        this.udpSocket = dgram.createSocket('udp4');
    }

    start(outputAddr: string = DEFAULTS.OUTPUT_ADDR, outputPort: number = DEFAULTS.OUTPUT_PORT, containersPorts: number[]) {
        this.udpSocket.on('message', (msg, rinfo) => {

            if (rinfo.port >= DEFAULTS.DOCKER_CONTAINERS_FIRST_PORT && rinfo.port < DEFAULTS.DOCKER_CONTAINERS_FIRST_PORT + 1000
                && rinfo.address === DEFAULTS.DOCKER_CONTAINERS_ADDR) {
                console.log(`Docker containers ProxyUDPServer got: ${msg.toString('hex')} from ${rinfo.address}:${rinfo.port}`);
                this.udpSocket.send(msg, outputPort, outputAddr)
            } else  if (rinfo.port === outputPort && rinfo.address === outputAddr) {
                console.log(`Docker containers ProxyUDPServer  got: ${msg.toString('hex')} from ${rinfo.address}:${rinfo.port}`);
                containersPorts.forEach((port) => {
                    this.udpSocket.send(msg, port, DEFAULTS.DOCKER_CONTAINERS_ADDR)
                })
            }
        });
        this.udpSocket.on('listening', () => {
            const address = this.udpSocket.address() as AddressInfo;
            console.log(`Docker containers ProxyUDPServer listening ${address.address}:${address.port}`);
        });
        this.udpSocket.bind(this.port);
    }

    stop() {
        this.udpSocket.close();
    }
}
