import * as winston from 'winston';
const { combine, timestamp, colorize} = winston.format;

export const LoggerConfig = {
    level: 'debug',
    transports: [
        new (winston.transports.Console)({
            stderrLevels: ['error'],
            format: combine(
                timestamp(),
                colorize()
            ),
        }),
        new (winston.transports.File)({
            filename: 'all-logs.log',
            maxFiles: 1,
            format: combine(
                timestamp(),
                colorize()
            ),
            level: 'debug',
            options: { flags: 'w' },
        }),
    ]
};
