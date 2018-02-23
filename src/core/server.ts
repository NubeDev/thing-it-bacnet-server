import { IBACnetModule } from './interfaces';

export class Server {

    static bootstrapServer (module: IBACnetModule) {
        return new Server();
    }

    /**
     * @constructor
     */
    constructor () {
    }
}
