import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs';

export function runContainer(fileName: string, port: number, edeDir: string): ChildProcess {
    let process: ChildProcess;
    try {
        process = spawn( 'docker', ['run', '-i', '--rm', '--name', `${fileName}`, '-v', `${edeDir}:/edefiles`, '-p', `${port}:47808/udp`, '-e', `FILE=${fileName}`, 'bacnet-server']);
        process.stdout.on('data', (data) => {
            console.log(`${fileName}: ${data}`)
        });
        process.stderr.on('data', (data) => {
            console.log(`${fileName}: ${data}`)
        });
        const containerLog = fs.createWriteStream(`./logs/${fileName}.container.log`);
        process.stdout.pipe(containerLog);
        const containerErrorsLog = fs.createWriteStream(`./logs/${fileName}.container.errors.log`);
        process.stderr.pipe(containerErrorsLog);
    } catch (error) {
        throw error;
    };
    return process;
}
