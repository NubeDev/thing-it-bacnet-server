import * as winston from 'winston';
const { combine, timestamp, colorize, printf} = winston.format;


export const logger = winston.createLogger({
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
});
