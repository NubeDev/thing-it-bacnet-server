import * as winston from 'winston';

import { LoggerConfig } from '../configs';

export const logger = winston.createLogger(LoggerConfig);
