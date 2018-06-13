import { spawn } from 'child_process';

export function runContainer(fileName: string, port: number) {
    spawn( 'docker', ['run', '-i', '--rm', '--name', '$FILE', '-p', '$PORT:47808/udp', '-e', 'FILE=$FILE', 'bacnet-server'], {
        env: {
            'FILE': fileName,
            'PORT': port,
        },
        shell: true
    });
}
