import { spawn, exec, ChildProcess } from 'child_process';
import * as stream from 'stream';

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
