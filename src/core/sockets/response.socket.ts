import * as dgram from 'dgram';
import * as _ from 'lodash';
import { logger } from '../utils';

import * as Bluebird from 'bluebird';

export class ResponseSocket {
    public className: string = 'ResponseSocket';

    constructor (private app: dgram.Socket,
        private port: number,
        private address: string) {
    }

    public send (message: Buffer): Bluebird<any> {
        logger.debug(`${this.className} - send (${this.address}:${this.port}): ${message.toString('hex')}`);
        return new Bluebird((resolve, reject) => {
            this.app.send(message, 0, message.length,
                this.port, this.address, (error, data) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(data);
                });
        });
    }

    public sendBroadcast (message: Buffer, address?: string, port?: number): Bluebird<any> {
        this.app.setBroadcast(true);
        const broadcastAddress = address ? address : '255.255.255.255';
        const broadcastPort = _.isNumber(port) ? port : this.port;

        logger.debug(`${this.className} - sendBroadcast (${broadcastAddress}:${broadcastPort}): ${message.toString('hex')}`);
        return new Bluebird((resolve, reject) => {
            this.app.send(message, 0, message.length,
                broadcastPort, broadcastAddress, (error, data) => {
                    this.app.setBroadcast(false);
                    if (error) {
                        return reject(error);
                    }
                    resolve(data);
                });
        });
    }
}
