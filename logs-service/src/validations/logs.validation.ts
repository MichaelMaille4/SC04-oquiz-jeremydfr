import z from "zod";
import { ObjectId } from "mongodb";

export const logLevelSchema = z.enum([
  "error",
  "warn",
  "info",
  "http",
  "verbose",
  "debug",
  "silly",
]);

export const createLogSchema = z.looseObject({
  level: logLevelSchema,
  message: z
    .string()
    .min(1, "Le message est requis")
    .max(10000, "Message trop long"),
  service: z.string().min(1, "Le service est requis").max(100),
  version: z.string().max(50).optional(),
  stackTrace: z.string().optional(),
  userId: z.string().optional(),
  requestId: z.string().optional(),
  sessionId: z.string().optional(),
  hostname: z.string().optional(),
  ip: z.string().optional(),
  userAgent: z.string().optional(),
  metadata: z.unknown().optional(),
  environment: z.string().max(100).default("development"),
  timestamp: z.preprocess(
    (val) => (val === undefined ? new Date().toISOString() : val),
    z.string().datetime(),
  ),
});

export type createLogRequest = z.infer<typeof createLogSchema>;
export type LogLevel = z.infer<typeof logLevelSchema>;

export const createLogsBatchSchema = z.object({
  data: z.array(createLogSchema).max(1000, "Max 1000 logs par batch"),
});

export type CreateLogsBatchRequest = z.infer<typeof createLogsBatchSchema>;

export const listLogsQuerySchema = z.object({
  service: z.string().min(1).optional(),
  level: logLevelSchema.optional(),
  environment: z.string().min(1).optional(),
  userId: z.string().min(1).optional(),
  requestId: z.string().min(1).optional(),
  sessionId: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const logIdParamSchema = z.object({
  id: z.string().refine(ObjectId.isValid, "Invalid ObjectId"),
});

export const logsStatsQuerySchema = z.object({
  service: z.string().min(1).optional(),
  environment: z.string().min(1).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type LogsStatsQuery = z.infer<typeof logsStatsQuerySchema>;

export const logsQuerySchema = z.object({
  service: z.string().optional(),
  level: z.enum(["info", "warn", "error"]).optional(),
  environment: z.string().optional(),
  userId: z.string().optional(),
  requestId: z.string().optional(),
  sessionId: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(5),
  offset: z.coerce.number().min(0).default(0),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type LogsQuery = z.infer<typeof logsQuerySchema>;
