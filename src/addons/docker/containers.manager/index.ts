import { Container } from './container';
import * as Bluebird from 'bluebird';
import { Logger } from '../logger';
import { ContainersInfo } from './containers.info.interface';
import { exec } from 'child_process';

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
        const containersNames = this.containers.map(container => container.name).join(' ');

        return new Bluebird((resolve, reject) => {
            this.logger.info(`Stopping docker containers: \n${containersNames.replace(/\s/g, '\n')}\n`);
            exec(`docker stop ${containersNames}`, (error, stdout, stderr) => {
                if (error) {
                    this.logger.error(`Unable to execute stop command for running containers:
                    ${error}`);
                }
                if (stderr) {
                    this.logger.error(`An error occured while stoping containers:
                    ${stderr}`);
                }
                if (stdout) {
                    this.logger.info(`Docker containers\n${stdout}have been successfully stopped`);
                }
                resolve();
              })
        })
        .then(() => {
            this.containers.forEach((container) => {
                container.fileLog.destroy();
                container.fileErrorsLog.destroy();
            })
        });
    }
}
