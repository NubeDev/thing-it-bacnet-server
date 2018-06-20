import * as Bluebird from 'bluebird';
import { ProxyUDPServer } from './proxy.server';
import { ContainersManager } from './containers.manager';
import * as DEFAULTS from './defaults';
import { Logger } from './logger';


export class Service {
    private containersManager: ContainersManager;
    private proxyServer: ProxyUDPServer;
    public logger: Logger = new Logger('Docker Service')
    constructor(
        private port: number = DEFAULTS.THIS_PORT,
        private outputAddr: string = DEFAULTS.OUTPUT_ADDR,
        private outputPort: number = DEFAULTS.OUTPUT_PORT,
        private portsStart: number = DEFAULTS.DOCKER_CONTAINERS_FIRST_PORT
    ) { }

    /**
     * start - inits containers manager and starts proxy UDP Server
     *
     * @param {string} [dirPath=DEFAULTS.EDEDIR] - path to ede files directory
     * @param {string[]} files - array of filenames of ede-files to simulate
     */
    start(dirPath: string = DEFAULTS.EDEDIR, files: string[]) {
        let nextPort = this.portsStart;
        this.logger.info('Initializing Containers Manager...');
        this.containersManager = new ContainersManager(dirPath);
        Bluebird.resolve().then(() => {
            files.forEach((fileName) => {
                const port = nextPort++;
                this.containersManager.initContainer(fileName, port)
            });
        })
        .then(() => {
            this.proxyServer = new ProxyUDPServer(this.port);
            this.proxyServer.start(this.outputAddr, this.outputPort, this.containersManager.containersInfo);
            this.logger.info('successfully started');
        })
    }

    /**
     *stop - stops proxy server and destroys containers manager
     *
     * @returns {Bluebird<any>}
     */
    stop(): Bluebird<any> {
        this.proxyServer.stop();
        return this.containersManager.destroy();
    }
}
