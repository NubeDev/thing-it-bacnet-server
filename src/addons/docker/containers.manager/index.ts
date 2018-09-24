import { Container } from './container';
import * as Bluebird from 'bluebird';
import { Logger } from '../logger';
import { ContainersInfo } from './containers.info.interface';

export class ContainersManager {
    private containers: Container[] = [];
    public containersInfo: ContainersInfo[] = [];
    public logger = new Logger('Docker Containers Manager');
    constructor(
        private edeDir: string
    ) {}

    /**
     *initCntainer - creates and starts docker container for specified ede-file name and port
     *
     * @param {string} name
     * @param {number} port
     */
    initContainer(name: string, port: number): void {
        this.logger.info(`Initializing container for ${name}.csv on port ${port}...`)
        const container: Container = new Container (name, port, this.edeDir);
        container.start();
        this.containers.push(container);
        this.containersInfo.push({ port, name });
    }

    /**
     * destroy - kills all docker containers processes and sends command to stop containers to docker
     *
     * @returns {Bluebird<any>}
     */
    destroy(): Bluebird<any> {
        this.containers.forEach((container) => {
            container.process.kill('SIGKILL');
        });
        return Bluebird.map(this.containers, (container) => {
            this.logger.info(`Stopping docker container ${container.name}... `);

            return new Bluebird((resolve, reject) => {
                container.stop((error, stdout, stderr) => {
                    if (error) {
                        this.logger.error(`Unable to execute stop command for ${container.name}: ${error}`)
                    }
                    if (stderr) {
                        this.logger.error(`An error occured while stoping ${container.name}: ${stderr}`);
                    }
                    if (stdout) {
                        this.logger.info(`Docker container ${stdout} has successfully stopped`);
                    }
                    resolve();
                  });
            });
        }, { concurrency: 1});
    }
}
