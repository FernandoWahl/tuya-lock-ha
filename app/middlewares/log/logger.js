const winston = require('winston');
const expressWinston = require('express-winston');
const { combine, timestamp, printf, colorize, json } = winston.format;

function parseMessage(message, object) {
    if (object) {
        if (object instanceof Error) {
            return message + ' - ' + object.stack;
        } else if (typeof object === 'object' && object !== null) {
            return message + ' - ' + JSON.stringify(object);
        } else {
            return message + ' - ' + object;
        }
    } else {
        return message;
    }
}

/** @param { import('express').Express} app */
module.exports = app => {
    const winstonLogger = winston.createLogger({
        level: process.env.APP_LOG_LEVEL,
        format: json(),
        transports: [
            new winston.transports.Console({
                format: combine(
                    winston.format(info => {
                        info.level = info.level.toUpperCase();
                        return info;
                    })(),
                    colorize(),
                    timestamp(),
                    printf(({ level, message, timestamp }) => {
                        return `${timestamp} -- ${level}: ${message}`;
                    })
                ),
            }),
        ],
        exitOnError: false,
    });

    const logFunctions = ['log', 'error', 'warn', 'verbose', 'info', 'debug', 'silly'];
    
    logFunctions.forEach(level => {
        this[level] = (message, object = null) => {
            winstonLogger[level](parseMessage(message, object));
        };
    });

    app.use(
        expressWinston.logger({
            transports: [new winston.transports.Console()],
            format: combine(
                winston.format((info, opts) => {
                    info.level = info.level.toUpperCase();
                    return info;
                })(),
                colorize(),
                timestamp(),
                printf(({ level, message, meta, timestamp }) => {
                    return `${timestamp} -- ${level}: ${message} ${meta.res.statusCode} ${meta.responseTime} ms`;
                })
            ),
        })
    );

    this.winstonLogger = winstonLogger

    return this;
};
