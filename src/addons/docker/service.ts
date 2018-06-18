import * as Bluebird from 'bluebird';
import * as Docker from './index';
import * as DEFAULTS from './defaults';

export class Service {
    private containersManager: Docker.ContainersManager;
    private proxyServer: Docker.ProxyUDPServer;
    constructor(
        private port: number = DEFAULTS.THIS_PORT,
        private outputAddr: string = DEFAULTS.OUTPUT_ADDR,
        private outputPort: number = DEFAULTS.OUTPUT_PORT,
        private portsStart: number = DEFAULTS.DOCKER_CONTAINERS_FIRST_PORT
    ) {}

    start(dirPath: string = DEFAULTS.EDEDIR, files: string[]) {
        let nextPort = this.portsStart
        this.containersManager = new Docker.ContainersManager(dirPath);
        Bluebird.resolve().then(() => {
            files.forEach((fileName) => {
                const port = nextPort++;
                this.containersManager.initContainer(fileName, port)
            });
        })
        .then(() => {
            this.proxyServer = new Docker.ProxyUDPServer(this.port);
            this.proxyServer.start(this.outputAddr, this.outputPort, this.containersManager.containersPorts)
        })
    }

    stop(): Bluebird<any> {
        this.proxyServer.stop();
        return this.containersManager.destroy();
    }
}
