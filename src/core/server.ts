import * as dgram from 'dgram';

import { IBACnetModule, IBACnetDevice } from './interfaces';

import { ApiError } from './errors';
import { logger } from './utils';

export class Server {
    private className: string = 'Server';
    private port: number;
    private device: IBACnetDevice;
    private app: dgram.Socket;

    static bootstrapServer (bacnetModule: IBACnetModule) {
        return new Server(bacnetModule);
    }

    /**
     * @constructor
     * @param {IBACnetModule} bacnetModule - module configuration
     */
    constructor (bacnetModule: IBACnetModule) {
        this.port = bacnetModule.port;
        this.device = bacnetModule.device;
        this.app = dgram.createSocket('udp4');
        this.startServer();
    }

    /**
     * startServer - starts the server.
     *
     * @return {void}
     */
    public startServer () {
        this.app.on('error', (error) => {
            logger.error(`${this.className} - startServer: UDP Error - ${error}`);
        });

        this.app.on('message', () => {
            ;
        });

        this.app.on('listening', () => {
            const addrInfo = this.app.address();
            logger.info(`${this.className} - startServer: UDP Server listening ${addrInfo.address}:${addrInfo.port}`);
        });

        if (!this.port) {
            throw new ApiError(`${this.className} - startServer: Port is required!`);
        }
        this.app.bind(this.port);
    }
}
