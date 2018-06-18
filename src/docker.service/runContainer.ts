import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs';

export function runContainer(fileName: string, port: number, edeDir: string): ChildProcess {
    let containerProcess: ChildProcess;
    try {
        containerProcess = spawn( 'docker', ['run', '-i', '--rm', '--name', `${fileName}`, '-v', `${edeDir}:/edefiles`, '-p', `${port}:47808/udp`, '-e', `FILE=${fileName}`, 'bacnet-server']);
        const containerLog = fs.createWriteStream(`./logs/${fileName}.container.log`);
        containerProcess.stdout.pipe(containerLog);
        const containerErrorsLog = fs.createWriteStream(`./logs/${fileName}.container.errors.log`);

        containerProcess.stdout.on('data', (data) => {
            console.log(`${fileName}: ${data}`)
        });
        containerProcess.stderr.on('data', (data: string) => {
            console.log(`${fileName}: ${data}`);
            if (data.includes('error')) {
                containerErrorsLog.write(data)
            } else {
                containerLog.write(data);
            }
        });

    } catch (error) {
        throw error;
    };
    return containerProcess;
}
