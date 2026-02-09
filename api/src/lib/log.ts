import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json(),
    format.printf(({timestamp, level, message, ...meta}) => {
      return JSON.stringify({
        timestamp,
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
    })
  ],
  exceptionHandlers: [new transports.File({ filename: 'logs/exceptions.log' })],
  rejectionHandlers: [new transports.File({ filename: 'logs/rejections.log' })],
});

if (process.env.NODE_ENV === 'development') {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple(),
        format.printf(({ timestamp, level, message, ...meta }) => {
          const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
          return `${timestamp} [${level}] : ${message} ${metaString}`;
        })
      )
    })
  );
}