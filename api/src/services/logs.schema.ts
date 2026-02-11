import { z } from "zod";

export const logCreateSchema = z
  .object({
    level: z.enum(["info", "warn", "error"]),
    message: z.string().min(1),
    service: z.string().min(1),

    version: z.string().optional(),
    environment: z.string().optional(),
    userId: z.string().optional(),
    requestId: z.string().optional(),
    sessionId: z.string().optional(),
    hostname: z.string().optional(),
    ip: z.string().optional(),
    userAgent: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    stackTrace: z.string().optional(),
    timestamp: z.string().optional(), // accepté mais écrasé
  })
  .passthrough();

export type LogCreateInput = z.infer<typeof logCreateSchema>;
