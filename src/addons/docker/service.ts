import * as Bluebird from 'bluebird';
import { ProxyUDPServer } from './proxy.server';
import { ContainersManager } from './containers.manager';
import * as DEFAULTS from './defaults';

export class Service {
    private containersManager: ContainersManager;
    private proxyServer: ProxyUDPServer;
    constructor(
        private port: number = DEFAULTS.THIS_PORT,
        private outputAddr: string = DEFAULTS.OUTPUT_ADDR,
        private outputPort: number = DEFAULTS.OUTPUT_PORT,
        public logger: any,
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
        this.logger.info('[Docker Service]: Initializing Containers Manager...');
        this.containersManager = new ContainersManager(dirPath, this.logger);
        Bluebird.resolve().then(() => {
            files.forEach((fileName) => {
                const port = nextPort++;
                this.containersManager.initContainer(fileName, port)
            });
        })
        .then(() => {
            const containersPorts: number[] = Array.from(this.containersManager.containersInfo.keys());
            this.proxyServer = new ProxyUDPServer(this.port, this.logger);
            this.proxyServer.start(this.outputAddr, this.outputPort, containersPorts);
            this.logger.info('[Docker Service]: successfully started');
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
