import { spawn, exec, ChildProcess } from 'child_process';

export class Container {
    public process: ChildProcess;
    constructor (public name: string,
        public port: number,
        private edeDir: string) { }

    start() {
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

    stop(callback) {
        exec(`docker stop ${this.name}`, callback)
    }
}
