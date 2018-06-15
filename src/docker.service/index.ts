import * as dgram from 'dgram';
import * as fs from 'fs';
import * as path from 'path';
import { argv } from 'yargs';
import * as Bluebird from 'bluebird';
import * as _ from 'lodash';
import { runContainer } from './runContainer';
import { ChildProcess } from 'child_process';

enum DEFAULTS {
    DOCKER_CONTAINERS_ADDR = '127.0.0.1',
    DOCKER_CONTAINERS_FIRST_PORT = 8001,
    THIS_PORT = 8000,
    OUTPUT_ADDR = '127.0.0.1',
    OUTPUT_PORT = 47808,
    EDEDIR = './edefiles'
}
const dirPath = argv.dirPath ? argv.dirPath : path.resolve(DEFAULTS.EDEDIR);
let nextPort = +DEFAULTS.DOCKER_CONTAINERS_FIRST_PORT;
let dockerContainersPorts = [];

if (!_.isString(dirPath) || !dirPath) {
    throw new Error('DockerService - Path to the EDE directory is required!');
}
if (!path.isAbsolute(dirPath)) {
    throw new Error('DockerService - Path to the EDE directory must be absolute!');
}
const dirStat = fs.statSync(dirPath);
let dockerContainersPromise;
const dockerContainersProcesses: ChildProcess[] = [];

if (dirStat.isFile()) {
    console.error('DockerService - Path is not a directory, attempt to start bacnet server from it');
    dockerContainersPromise = new Bluebird((resolve, reject) => {
        const fileName = dirPath.split('/').pop();
        const port = nextPort++;
        const containerProcess: ChildProcess = runContainer(fileName, port, path.resolve(dirPath, '../'));
        dockerContainersProcesses.push(containerProcess);
        dockerContainersPorts.push(port);
        resolve();
    })
}

if (dirStat.isDirectory()) {

    dockerContainersPromise = new Bluebird((resolve, reject) => {
        fs.readdir(dirPath, (err, files) => {
            if (err) {
                reject(err);
            } else {
                files.forEach((filePath) => {
                    const fileName = filePath.split('/').pop();
                    const port = nextPort++;
                    const containerProcess: ChildProcess = runContainer(fileName, port, dirPath);
                    dockerContainersProcesses.push(containerProcess);
                    dockerContainersPorts.push(port);
                });
                resolve();
            }
        })
    })


}


const dockerMulticastServer = dgram.createSocket({
    type: 'udp4',
    reuseAddr: true
});

const outputAddr = process.env.OUTPUT_ADDR ? process.env.OUTPUT_ADDR : DEFAULTS.OUTPUT_ADDR;
const outputPort = process.env.OUTPUT_PORT ? +process.env.OUTPUT_PORT : DEFAULTS.OUTPUT_PORT;

dockerMulticastServer.on('error', (err) => {
  console.log(`dockerMulticastServer error:\n${err.stack}`);
  dockerMulticastServer.close();
});

dockerContainersPromise.then(() => {
    dockerMulticastServer.on('message', (msg, rinfo) => {

        if (rinfo.port >= DEFAULTS.DOCKER_CONTAINERS_FIRST_PORT && rinfo.port < DEFAULTS.DOCKER_CONTAINERS_FIRST_PORT + 1000 && rinfo.address === DEFAULTS.DOCKER_CONTAINERS_ADDR) {
          console.log(`dockerMulticastServer got: ${msg.toString('hex')} from ${rinfo.address}:${rinfo.port}`);
          dockerMulticastServer.send(msg, outputPort, outputAddr)
        } else  if (rinfo.port === outputPort && rinfo.address === outputAddr) {
          console.log(`dockerMulticastServer got: ${msg.toString('hex')} from ${rinfo.address}:${rinfo.port}`);
          dockerContainersPorts.forEach((port) => {
              dockerMulticastServer.send(msg, port, DEFAULTS.DOCKER_CONTAINERS_ADDR)
          })
        }
      });
      dockerMulticastServer.on('listening', () => {
        const address = dockerMulticastServer.address();
        console.log(`dockerMulticastServer listening ${address.address}:${address.port}`);
      });
      dockerMulticastServer.bind(DEFAULTS.THIS_PORT);
});
