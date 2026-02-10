import { createLogger, format, transports } from "winston";
import { config } from "../../config.ts";

export const logger = createLogger({
  level: 'info',
  // defaultMeta : modifie les données envoyé pour les transports
  defaultMeta: { service: 'oquiz', pid: process.pid },
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
    new transports.Http({
      host: config.logsServiceHost, // Attention ici à ne pas mettre http:// ou https:// !!!
      port: Number(config.logsServicePort),
      path: '/api/logs',
    })
  ],
  exceptionHandlers: [new transports.File({ filename: 'logs/exceptions.log' })],
  rejectionHandlers: [new transports.File({ filename: 'logs/rejections.log' })],
});
