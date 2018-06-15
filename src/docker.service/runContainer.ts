import { spawn, ChildProcess } from 'child_process';

export function runContainer(fileName: string, port: number, edeDir: string) {
    spawn( 'docker', ['run', '-i', '--rm', '--name', `${fileName}`, '-v', `${edeDir}:/edefiles`, '-p', `${port}:47808/udp`, '-e', `FILE=${fileName}`, 'bacnet-server']);
}

