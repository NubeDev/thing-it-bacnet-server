import * as fs from 'fs';
import * as path from 'path';
import { argv } from 'yargs';
import * as _ from 'lodash';
import * as Docker from './index';
import * as DEFAULTS from './defaults';
import { logger } from './logger';


logger.info('Starting Docker Service...');

const dirPath = argv.dirPath ? argv.dirPath : DEFAULTS.EDEDIR;

if (!_.isString(dirPath) || !dirPath) {
    throw new Error('[Docker addon]: Path to the EDE directory is required!');
}
if (!path.isAbsolute(dirPath)) {
    throw new Error('[Docker addon]: Path to the EDE directory must be absolute!');
}
const dirStat = fs.statSync(dirPath);
if (!fs.existsSync('./logs') || fs.statSync('./logs').isFile()) {
    fs.mkdirSync('./logs');
}

const dockerService = new Docker.Service(argv.port, argv.outputAddr, argv.outputPort, logger)
if (dirStat.isFile()) {
    logger.error('[Docker addon]: Path is a file, attempt to start bacnet server from it...');
    const fileName = dirPath.split('/').pop().split('.').slice(0, -1).join('.');
    const parentPath = path.resolve(dirPath, '../');
    dockerService.start(parentPath, [ fileName ]);
}
if (dirStat.isDirectory()) {

    fs.readdir(dirPath, (err, files) => {
        if (err) {
            throw err;
        } else {
            const fileNames = files.map((file) => file.split('.').slice(0, -1).join('.'))
            dockerService.start(dirPath, fileNames);

        }
    });
}

process.on('SIGINT', () => {
    dockerService.stop().then(() => {
        process.exit(0);
    })
});
process.on('SIGTERM', () => {
    dockerService.stop().then(() => {
        process.exit(0);
    })
});
process.on('SIGABRT', () => {
    dockerService.stop().then(() => {
        process.exit(0);
    })
});
process.on('beforeExit', () => {
    dockerService.stop()
});
