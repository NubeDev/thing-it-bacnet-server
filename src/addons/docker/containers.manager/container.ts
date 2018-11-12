import * as stream from 'stream';
import * as colors from 'colors';
import * as fs from 'fs';
import * as Dockerode from 'dockerode';
const docker = new Dockerode({
    socketPath: '/var/run/docker.sock',
    Promise: require('bluebird')
});

export class Container {
    public stdout  = new stream.PassThrough();
    public stderr  = new stream.PassThrough();
    public container: Dockerode.Container;
    public fileLog: stream.Writable;
    public fileErrorsLog: stream.Writable;

    constructor (public name: string,
        public port: number,
        private edeDir: string) { }

    /**
     * start runs docker container with specified options
     */
    public start(): void {
        this.initLogging();
        docker.createContainer(
            {
                Image: 'bacnet-server',
                name: this.name,
                Cmd: [ /*'node', './dist/index', '--filePath /edefiles/$FILE', '--dockerized'*/ ],
                Tty: false,
                Env: [`FILE=${this.name}.csv`],
                Volumes: {
                    '/edefiles': {}
                },
                ExposedPorts: {
                    '47808/udp': {}
                },
                AttachStdout: true,
                AttachStderr: true,
                AttachStdin: true,
                HostConfig: {
                    Binds: [`${this.edeDir}:/edefiles`],
                    PortBindings: {
                        '47808/udp': [{ HostPort: `${this.port}`}]
                    },
                AutoRemove: true
                },
            }
        ).then((container: Dockerode.Container) => {
            this.container = container;
            container.start();
            return container.attach({ stream: true, stdout: true, stderr: true })
        })
        .then((containerStream) => {
            this.container.modem.demuxStream(containerStream, this.stdout, this.stderr);
        })
    }

    private logCallback(data: string): void {
        console.log(colors.yellow(`${this.name}:`), ` ${data}`)
    }

    private errorLogCallback = (data: string) => {
        console.log(colors.yellow(`${this.name}:`) + ` ${data}`);
        if (data.includes('error')) {
            this.fileErrorsLog.write(data)
        } else {
            this.fileLog.write(data);
        }
    }

    /**
     * initLogging - creates file streams for writing container common and errors log,
     * adds event listener to container's stdout and stderr streams to log output into console
     *
     */
    initLogging(): void {
        this.fileLog = fs.createWriteStream(`./logs/${this.name}.container.log`);
        this.stdout.pipe(this.fileLog);
        this.stdout.on('data', this.logCallback);

        this.fileErrorsLog = fs.createWriteStream(`./logs/${this.name}.container.errors.log`);
        this.stderr.on('data', this.errorLogCallback);
    }

    /**
     * stop - runs docker stop command for the container,
     * destroys file logging streams
     *
     * @param {Function} callback - callback to process exec output
     */
    stop(): Promise<void> {
        this.stdout.removeListener('data', this.logCallback);
        this.stderr.removeListener('data', this.errorLogCallback);
        return this.container.stop()
            .then(() => {
                this.fileLog.destroy();
                this.fileErrorsLog.destroy();
            });
    }
}
