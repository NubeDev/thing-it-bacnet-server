import * as Bluebird from 'bluebird';
import * as _ from 'lodash';
import * as path from 'path';
import { argv } from 'yargs';

import { InputSocket, OutputSocket, Server } from '../core/sockets';

import { unconfirmedReqService } from '../services';

import { mainRouter } from '../routes';

import {
    ApiError,
} from '../core/errors';

import {
    IAppConfig,
    IBACnetAddressInfo,
} from '../core/interfaces';

import {
    logger,
    AsyncUtil,
} from '../core/utils';

export class AppManager {
    private server: Server;

    constructor (private appConfig: IAppConfig) {
        this.handleArgs();
        this.server = new Server(this.appConfig.server, mainRouter);
        this.initServices();
    }

    public handleArgs () {
        if (!_.isString(argv.filePath) || !argv.filePath) {
            throw new ApiError('AppManager - handleArgs: Path to the EDE file is required!');
        }
        if (!path.isAbsolute(argv.filePath)) {
            throw new ApiError('AppManager - handleArgs: Path to the EDE file must be absolute!');
        }
        this.appConfig.bacnet.edeFilePath = argv.filePath;

        if (argv.port) {
            this.appConfig.server.port = argv.port;
        }

        if (argv.reqDelay) {
            this.appConfig.server.outputSequence.delay = +argv.reqDelay;
        }

        if (argv.reqThread) {
            this.appConfig.server.outputSequence.thread = +argv.reqThread;
        }
    }

    public initServices () {
        // this.edeStorageManager = new EDEStorageManager(this.appConfig.ede);
        // this.server.registerService('edeStorage', this.edeStorageManager);
    }

    public start () {
        this.server.startServer();
    }
}
