import * as winston from 'winston';

export const LoggerConfig = {
    level: 'debug',
    transports: [
        new (winston.transports.File)({
            filename: 'logs/debug-all.log',
            timestamp: true,
            colorize: true,
            level: 'debug'
        }),
        new (winston.transports.Console)({
            timestamp: true,
            colorize: true,
            level: 'debug'
        })
    ]
};
