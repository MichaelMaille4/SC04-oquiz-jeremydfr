import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json(),
    format.printf(({level, message, ...meta}) => {
      return JSON.stringify({
        level,
        message,
        service: 'oquiz',
        pid: process.pid,
        ...meta
      });
    }),
  ),
  transports: [
    new transports.File({
      filename: 'logs/errors/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 3,
      tailable: true
    }),
    new transports.File({
      filename: 'logs/combined/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 3,
      tailable: true
    }),
    // TODO : Check HTTP transport
    new transports.Http({
      port: 3001,
      path: '/api/logs',
      format: format.combine(
        format.json(),
        format.printf(() => {
          return JSON.stringify({
            test: "test"
          });
        }),
      )
    })
  ],
  exceptionHandlers: [new transports.File({ filename: 'logs/exceptions.log' })],
  rejectionHandlers: [new transports.File({ filename: 'logs/rejections.log' })],
});
