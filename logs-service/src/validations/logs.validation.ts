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

export const createBatchLogSchema = z.object({
    logs: z.array(createLogSchema).min(1).max(1000, "Maximum 1000 logs par batch")
});

export const logFilterSchema = z.object({
    service: z.string().optional(),
    level: z.string().optional(),
    environment: z.string().optional(),
    userId: z.string().optional(),
    requestId: z.string().optional(),
    sessionId: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    limit: z.coerce.number().min(1).max(100).default(50),
    offset: z.coerce.number().min(0).default(0)
});

export const logStatFilterSchema = z.object({
    service: z.string().optional(),
    environment: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
});

export type CreateLogRequest = z.infer<typeof createLogSchema>
export type LogLevel = z.infer<typeof logLevelSchema>
export type LogFilterRequest = z.infer<typeof logFilterSchema>
export type LogStatFilterRequest = z.infer<typeof logStatFilterSchema>