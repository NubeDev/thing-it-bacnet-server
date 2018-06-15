import { spawn, ChildProcess } from 'child_process';

export function runContainer(fileName: string, port: number, edeDir: string): ChildProcess {
    let process: ChildProcess = spawn( 'docker', ['run', '-i', '--rm', '--name', `${fileName}`, '-v', `${edeDir}:/edefiles`, '-p', `${port}:47808/udp`, '-e', `FILE=${fileName}`, 'bacnet-server']);
    return process;
}
