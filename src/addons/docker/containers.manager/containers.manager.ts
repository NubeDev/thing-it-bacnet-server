import * as fs from 'fs';
import { Container } from './container';
import * as Bluebird from 'bluebird';

export class ContainersManager {
    private containers: Container[] = [];
    public containersPorts: number[] = [];
    constructor(private edeDir: string) {}

    initContainer(name: string, port: number) {
        const container: Container = new Container (name, port, this.edeDir);
        container.start();
        this.containers.push(container);
        this.containersPorts.push(port);
        this.logContainer(container);
    }

    destroy(): Bluebird<any> {
        this.containers.forEach((container) => {
            container.process.kill('SIGKILL');
        });
        return Bluebird.map(this.containers, (container) => {
            console.log(`Stopping docker container ${container.name}... `);

            return new Bluebird((resolve, reject) => {
                container.stop((error, stdout, stderr) => {
                    if (error) {
                      console.error(`Unable to execute stop command for ${container.name}: ${error}`)
                    }
                    if (stderr) {
                        console.error(`An error occured while stoping ${container.name}: ${stderr}`);
                    }
                    if (stdout) {
                        console.log(`Docker container ${stdout} successfully stopped`);
                    }
                    resolve();
                  });
            });
        }, { concurrency: 1});
    }

    logContainer(container: Container): void {
        const containerLog = fs.createWriteStream(`./logs/${container.name}.container.log`);
        container.process.stdout.pipe(containerLog);
        const containerErrorsLog = fs.createWriteStream(`./logs/${container.name}.container.errors.log`);

        container.process.stdout.on('data', (data) => {
            console.log(`${container.name}: ${data}`)
        });
        container.process.stderr.on('data', (data: string) => {
            console.log(`${container.name}: ${data}`);
            if (data.includes('error')) {
                containerErrorsLog.write(data)
            } else {
                containerLog.write(data);
            }
        });
    }
}
