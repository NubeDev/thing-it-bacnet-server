import { exec } from 'child_process';

export function runContainer(fileName: string, port: number, edeDir: string) {
    exec( 'docker run --rm --name $FILE -v $EDEDIR:/edefiles -p $PORT:47808/udp -e FILE=$FILE bacnet-server', {
        env: {
            'FILE': fileName,
            'PORT': port,
            'EDEDIR': edeDir,
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
