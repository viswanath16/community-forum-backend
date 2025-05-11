// src/utils/logger.ts
import winston from 'winston';
import environment from '../config/environment';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const level = () => {
    const env = environment.NODE_ENV || 'development';
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'warn';
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

const transports = [
    new winston.transports.Console(),
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),
    new winston.transports.File({ filename: 'logs/all.log' }),
];


const isDevelopment = process.env.NODE_ENV === 'development';

// Simple console logger for serverless environments
const logger = {
    error: (...args: any[]) => {
        console.error(new Date().toISOString(), '[ERROR]', ...args);
    },
    warn: (...args: any[]) => {
        console.warn(new Date().toISOString(), '[WARN]', ...args);
    },
    info: (...args: any[]) => {
        console.log(new Date().toISOString(), '[INFO]', ...args);
    },
    http: (...args: any[]) => {
        console.log(new Date().toISOString(), '[HTTP]', ...args);
    },
    debug: (...args: any[]) => {
        if (isDevelopment) {
            console.log(new Date().toISOString(), '[DEBUG]', ...args);
        }
    },
};

export default logger;