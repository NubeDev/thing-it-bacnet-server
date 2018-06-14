import { exec } from 'child_process';

export function runContainer(fileName: string, port: number) {
    exec( 'docker run --rm --name $FILE -p $PORT:47808/udp -e FILE=$FILE bacnet-server', {
        env: {
            'FILE': fileName,
            'PORT': port,
        },
    }, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      });
}
