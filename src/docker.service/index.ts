import * as dgram from 'dgram';
import * as fs from 'fs';
import * as path from 'path';
import { argv } from 'yargs';
import * as Bluebird from 'bluebird';
import * as _ from 'lodash';
import { runContainer } from './runContainer';

enum DEFAULTS {
    INPUT_ADDR = 'localhost',
    INPUT_PORT = 8000,
    OUTPUT_ADDR = 'localhost',
    OUTPUT_PORT = 47808,
    EDEDIR = './edefiles'
}
const dirPath = argv.dirPath ? argv.dirPath : DEFAULTS.EDEDIR;
let nextPort = DEFAULTS.INPUT_PORT + 1;
let dockerContainersPorts = [];

if (!_.isString(dirPath) || !dirPath) {
    throw new Error('DockerService - Path to the EDE directory is required!');
}
// if (!path.isAbsolute(dirPath)) {
//     throw new Error('DockerService - Path to the EDE directory must be absolute!');
// }
const dirStat = fs.statSync(dirPath);
if (dirStat.isFile()) {
    console.error('DockerService - Path is not a directory, attempt to start bacnet server from it');
    const fileName = dirPath.split('/').pop();
    const port = nextPort++;
    runContainer(fileName, port);
    dockerContainersPorts.push(port);
}

if (dirStat.isDirectory()) {

        fs.readdir(dirPath, (err, files) => {
            if (err) {
                throw err;
            } else {
                files.forEach((filePath) => {
                    const fileName = filePath.split('/').pop();
                    const port = nextPort++;
                    runContainer(fileName, port);
                    dockerContainersPorts.push(port);
                })
            }
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

dockerMulticastServer.on('message', (msg, rinfo) => {

  if (rinfo.port > DEFAULTS.INPUT_PORT && rinfo.port < DEFAULTS.INPUT_PORT + 1000) {
    console.log(`server1 got: ${msg.toString('hex')} from ${rinfo.address}:${rinfo.port}`);
    dockerMulticastServer.send(msg, outputPort, outputAddr)
  } else  if (rinfo.address === outputAddr && rinfo.port === outputPort) {
    console.log(`server1 got: ${msg.toString('hex')} from ${rinfo.address}:${rinfo.port}`);
    dockerContainersPorts.forEach((port) => {
        dockerMulticastServer.send(msg, port, 'localhost')
    })
  }

});

dockerMulticastServer.on('listening', () => {
  const address = dockerMulticastServer.address();
  console.log(`dockerMulticastServer listening ${address.address}:${address.port}`);
});
dockerMulticastServer.bind(DEFAULTS.INPUT_PORT, DEFAULTS.INPUT_ADDR);
