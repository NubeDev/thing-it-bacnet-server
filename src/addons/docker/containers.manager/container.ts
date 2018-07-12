import { spawn, exec, ChildProcess } from 'child_process';
import * as stream from 'stream';
import * as colors from 'colors';
import * as fs from 'fs';

export class Container {
    public process: ChildProcess;
    public fileLog: stream.Writable;
    public fileErrorsLog: stream.Writable;

    constructor (public name: string,
        public port: number,
        private edeDir: string) { }

    /**
     * start runs docker container with specified options
     */
    start(): void {
        this.process = spawn( 'docker', [
            'run',
            '-i',
            '--rm',
            '--name', `${this.name}`,
            '-v', `${this.edeDir}:/edefiles`,
            '-p', `${this.port}:47808/udp`,
            '-e', `FILE=${this.name}.csv`,
            'bacnet-server'
        ]);
        this.startLogging();
    }

    /**
     * logContainer - creates file Streams for writing container common and errors log,
     * adds event listener to container child processes to log output into console
     *
     */
    startLogging(): void {
        this.fileLog = fs.createWriteStream(`./logs/${this.name}.container.log`);
        this.process.stdout.pipe(this.fileLog);
        this.process.stdout.on('data', (data) => {
            console.log(colors.yellow(`${this.name}:`), ` ${data}`)
        });

        this.fileErrorsLog = fs.createWriteStream(`./logs/${this.name}.container.errors.log`);
        this.process.stderr.on('data', (data: string) => {
            console.log(colors.yellow(`${this.name}:`) + ` ${data}`);
            if (data.includes('error')) {
                this.fileErrorsLog.write(data)
            } else {
                this.fileLog.write(data);
            }
        });
    }

    /**
     * stop - runs docker stop command for the container,
     * destroys file logging streams
     *
     * @param {Function} callback - callback to process exec output
     */
    stop(callback: Function): void {
        exec(`docker stop ${this.name}`, (error, stdout, stderr) => {
            callback(error, stdout, stderr);
        });
        this.fileLog.destroy();
        this.fileErrorsLog.destroy();
    }
}
