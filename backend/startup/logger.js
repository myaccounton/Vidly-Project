const { createLogger, format, transports } = require('winston');
require('winston-mongodb');

const loggerTransports = [];

if (process.env.NODE_ENV === 'production') {
  loggerTransports.push(
    new transports.Console({ level: 'info' }),
    new transports.File({ filename: 'logs/errors.log', level: 'error' }),
    new transports.MongoDB({ 
      db: process.env.MONGODB_URI || 'mongodb://localhost/vidly', 
      level: 'error'
    })
  );
} else if (process.env.NODE_ENV === 'test') {
  loggerTransports.push(new transports.Console({ silent: true }));
} else {
  loggerTransports.push(
    new transports.Console({ level: 'debug' }),
    new transports.File({ filename: 'logs/dev.log', level: 'debug' })
  );
}

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, stack }) =>
      stack
        ? `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`
        : `${timestamp} [${level.toUpperCase()}]: ${message}`
    )
  ),
  transports: loggerTransports,
  exceptionHandlers: [
    new transports.File({ filename: 'logs/uncaughtExceptions.log' })
  ],
  rejectionHandlers: [
    new transports.File({ filename: 'logs/unhandledRejections.log' })
  ]
});

process.on('unhandledRejection', (ex) => {
  throw ex;
});

module.exports = logger;