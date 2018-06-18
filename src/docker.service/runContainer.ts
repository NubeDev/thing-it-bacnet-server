import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs';

export function runContainer(fileName: string, port: number, edeDir: string): ChildProcess {
    let containerProcess: ChildProcess;
    try {
        containerProcess = spawn( 'docker', ['run', '-i', '--rm', '--name', `${fileName}`, '-v', `${edeDir}:/edefiles`, '-p', `${port}:47808/udp`, '-e', `FILE=${fileName}`, 'bacnet-server']);
        containerProcess.stdout.on('data', (data) => {
            console.log(`${fileName}: ${data}`)
        });
        containerProcess.stderr.on('data', (data) => {
            console.log(`${fileName}: ${data}`)
        });
        const containerLog = fs.createWriteStream(`./logs/${fileName}.container.log`);
        containerProcess.stdout.pipe(containerLog);
        const containerErrorsLog = fs.createWriteStream(`./logs/${fileName}.container.errors.log`);
        containerProcess.stderr.pipe(containerErrorsLog);
    } catch (error) {
        throw error;
    };
    return containerProcess;
}
