import * as winston from 'winston';
const { combine, timestamp, colorize, printf } = winston.format;

const LoggerConfig = {
    level: 'debug',
    transports: [
        new (winston.transports.Console)({
            stderrLevels: ['error'],
            format: combine(
                timestamp(),
                colorize(),
                printf(data => ` ${data.timestamp} - ${data.level}: ${data.message}`)
            ),
        }),
        new (winston.transports.File)({
            filename: './logs/docker-service.log',
            maxFiles: 1,
            format: combine(
                timestamp(),
                printf(data => ` ${data.timestamp} - ${data.level}: ${data.message}`)
            ),
            options: { flags: 'w' },
        }),
    ]
};

export class Logger {
    private _logger: winston.Logger = winston.createLogger(LoggerConfig);;
    constructor (public label: string) { }

    info( message: string) {
        this._logger.info(`[${this.label}]: ${message}`)
    }

    debug(message: string) {
        this._logger.debug(`[${this.label}]: ${message}`)
    }

    error(message: string) {
        this._logger.error(`[${this.label}]: ${message}`)
    }
}

