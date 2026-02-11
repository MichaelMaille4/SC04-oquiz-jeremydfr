import type { Request, Response } from "express";
import { ObjectId } from "mongodb";
import * as logsService from "../services/logs.service.ts";
import {
  createLogSchema,
  createLogsBatchSchema,
  logIdParamSchema,
  listLogsQuerySchema,
  logsQuerySchema,
  logsStatsQuerySchema,
} from "../validations/logs.validation.ts";

export async function createLog(req: Request, res: Response) {
  const parsed = createLogSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  await logsService.createLog(parsed.data);
  return res.status(201).json({ data: parsed.data });
}

export async function createLogsBatch(req: Request, res: Response) {
  const parsed = createLogsBatchSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const createdIds = await logsService.createManyLogs(parsed.data.data);
  return res.status(201).json({ data: createdIds });
}

export async function getLogs(req: Request, res: Response) {
  const parsed = logsQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { data, pagination } = await logsService.getLogs(parsed.data);
  return res.status(200).json({ data, pagination });
}

export async function getLogById(req: Request, res: Response) {
  const parsed = logIdParamSchema.safeParse(req.params);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const log = await logsService.getLogById(parsed.data.id);

  if (!log) {
    return res.status(404).json({ error: "Log not found" });
  }

  return res.status(200).json({ data: log });
}

export async function getLogsStats(req: Request, res: Response) {
  const parsed = logsStatsQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const stats = await logsService.getLogsStats(parsed.data);
  return res.status(200).json(stats);
}
