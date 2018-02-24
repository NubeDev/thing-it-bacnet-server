import * as dgram from 'dgram';

import * as Bluebird from 'bluebird';

export class ResponseSocket {

    constructor (private app: dgram.Socket,
        private port: number,
        private address: string) {
    }

    public send (message: Buffer): Bluebird<any> {
        return new Bluebird((resolve, reject) => {
            this.app.send(message, 0, message.length,
                this.port, this.address, (error, data) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(data);
                });
        });
    }
}
