import * as winston from 'winston';
const { combine, timestamp, colorize, printf, label} = winston.format;

export function initLogger (labelString: string) {
    return winston.createLogger({
        level: 'debug',
        transports: [
            new (winston.transports.Console)({
                stderrLevels: ['error'],
                format: combine(
                    timestamp(),
                    label({label: labelString}),
                    colorize(),
                    printf(data => ` ${data.timestamp} [${data.label}] - ${data.level}: ${data.message}`)
                ),
            }),
            new (winston.transports.File)({
                filename: './logs/docker-service.log',
                maxFiles: 1,
                format: combine(
                    timestamp(),
                    label({label: labelString}),
                    printf(data => ` ${data.timestamp} [${data.label}] - ${data.level}: ${data.message}`)
                ),
                options: { flags: 'w' },
            }),
        ]
    })
}
