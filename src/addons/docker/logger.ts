import * as winston from 'winston';

const LoggerConfig = {
    level: 'debug',
    transports: [
        new (winston.transports.Console)({
            stderrLevels: ['error'],
            timestamp: true,
            colorize: true,
        }),
        new (winston.transports.File)({
            filename: './logs/docker-service.log',
            maxFiles: 1,
            timestamp: true,
            colorize: false,
            level: 'info',
            options: { flags: 'w' },
        }),
    ]
};

export class Logger {
    private _logger = new winston.Logger(LoggerConfig);
    constructor (public label: string) { }

    info( message: string) {
        this._logger.info(`[${this.label}]: ${message}`)
    }

    warn( message: string) {
        this._logger.warn(`[${this.label}]: ${message}`)
    }

    debug(message: string) {
        this._logger.debug(`[${this.label}]: ${message}`)
    }

    error(message: string) {
        this._logger.error(`[${this.label}]: ${message}`)
    }
}

