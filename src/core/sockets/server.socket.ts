import * as dgram from 'dgram';

import * as Bluebird from 'bluebird';
import * as _ from 'lodash';

import { Subject } from 'rxjs';

import { IServerConfig, IBACnetAddressInfo, ISequenceFlow } from '../interfaces';

import { ApiError } from '../errors';
import { logger } from '../utils';

import { InputSocket } from './input.socket';
import { OutputSocket } from './output.socket';
import { ServiceSocket } from './service.socket';

import { SequenceManager } from '../../managers/sequence.manager';
import { AddressInfo } from 'net';

export class Server {
    private className: string = 'Server';
    private sock: dgram.Socket;
    private serviceSocket: ServiceSocket;
    private sequenceManager: SequenceManager;
    private reqFlow: Subject<ISequenceFlow>;

    /**
     * @constructor
     * @param {IBACnetModule} bacnetModule - module configuration
     */
    constructor (private serverConfig: IServerConfig,
            private mainRouter: any) {
        this.reqFlow = new Subject();
        this.serviceSocket = new ServiceSocket();
        this.sequenceManager = new SequenceManager(this.serverConfig.outputSequence, this.reqFlow);
    }

    /**
     * destroy - destroys the socket connection.
     *
     * @return {Bluebird<any>}
     */
    public destroy (): Bluebird<any> {
        return new Bluebird((resolve, reject) => {
            this.sock.close(() => { resolve(); });
        });
    }

    /**
     * startServer - starts the server.
     *
     * @return {void}
     */
    public startServer () {
        this.sock = dgram.createSocket('udp4');

        this.sock.on('error', (error) => {
            logger.error(`${this.className} - startServer: UDP Error - ${error}`);
        });

        this.sock.on('message', (msg: Buffer, rinfo: dgram.RemoteInfo) => {
            let bacnetMsg;
            let outputSoc;

            if (this.serverConfig.dockerized) {

                try {
                    const parsedMsg = JSON.parse(msg.toString());
                    bacnetMsg = parsedMsg.msg;
                    outputSoc = this.genOutputSocket({
                        port: rinfo.port, address: rinfo.address,
                    }, parsedMsg.rinfo);
                } catch (error) {
                    throw new ApiError ('Unable to treat message as JSON, trying to parse as bacnet message...');
                    bacnetMsg = msg;
                    outputSoc = this.genOutputSocket({
                        port: rinfo.port, address: rinfo.address,
                    });
                }

            } else {
                bacnetMsg = msg;
                outputSoc = this.genOutputSocket({
                    port: rinfo.port, address: rinfo.address,
                });
            }

            // Generate Request instance
            const inputSoc = new InputSocket(msg);
            // Handle request
            try {
                this.mainRouter(inputSoc, outputSoc, this.serviceSocket);
            } catch (error) {
                logger.error(`Server - router:`, error);
            }
        });

        const startPromise = new Bluebird((resolve, reject) => {
            this.sock.on('listening', () => {
                const addrInfo = this.sock.address() as AddressInfo;
                logger.info(`${this.className} - startServer: UDP Server listening ${addrInfo.address}:${addrInfo.port}`);
                resolve(addrInfo);
            });
        })

        if (!this.serverConfig.port) {
            throw new ApiError(`${this.className} - startServer: Port is required!`);
        }
        this.sock.bind(this.serverConfig.port);
        return startPromise;
    }

    /**
     * genOutputSocket - generates and returns the instance of OutputSocket.
     *
     * @param  {IBACnetAddressInfo} rinfo - object with endpoint address and port
     * @return {OutputSocket}
     */
    public genOutputSocket (rinfo: IBACnetAddressInfo, rinfoOriginal?: IBACnetAddressInfo): OutputSocket {
        return new OutputSocket(this.sock, rinfo, this.reqFlow, rinfoOriginal);
    }

    public registerService (serviceName: string, service: any) {
        this.serviceSocket.addService(serviceName, service);
    }
}
