import * as winston from 'winston';

import { LoggerConfig } from '../configs';

export const logger = new winston.Logger(LoggerConfig);
