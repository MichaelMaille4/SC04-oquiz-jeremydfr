import z from "zod";

export const logLevelSchema = z.enum([
    'error',
    'warn',
    'info',
    'http',
    'verbose',
    'debug',
    'silly'
]);

export const createLogSchema = z.looseObject({
    level: logLevelSchema,
    message: z.string().min(1, 'Le message est requis').max(10000, 'Message trop long'),
    service: z.string().min(1, 'Le service est requis').max(100),
    version: z.string().max(50).optional(),
    stackTrace: z.string().optional(),
    userId: z.string().optional(),
    requestId: z.string().optional(),
    sessionId: z.string().optional(),
    hostname: z.string().optional(),
    ip: z.string().optional(),
    userAgent: z.string().optional(),
    metadata: z.unknown().optional(),
    environment: z.string().max(100).default('development'),
    timestamp: z.string().optional().default(new Date().toString()),
});

export type createLogRequest = z.infer<typeof createLogSchema>
export type LogLevel = z.infer<typeof logLevelSchema>