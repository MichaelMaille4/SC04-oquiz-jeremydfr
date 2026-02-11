import type { Request, Response } from "express";
import {
  createBatchLogSchema,
  createLogSchema,
  logFilterSchema,
  logStatFilterSchema,
} from "../validations/logs.validation.ts";
import * as logService from "../services/logs.service.ts";
import { idParamSchema } from "../validations/utils.ts";

export async function createLog(req: Request, res: Response) {
  const logData = createLogSchema.parse(req.body);

  await logService.createLog(logData);

  return res.status(201).json({
    message: "Log créé avec succès",
  });
}

export async function createBatchLogs(req: Request, res: Response) {
  const { logs } = createBatchLogSchema.parse(req.body);

  const logsData = await logService.createBatchLogs(logs);

  return res.status(201).json({
    data: logsData,
  });
}

export async function getLogs(req: Request, res: Response) {
  const filters = logFilterSchema.parse(req.query);

  const logsWithPagination = await logService.getLogs(filters);

  return res.json(logsWithPagination);
}

export async function getLogById(req: Request, res: Response) {
  const { id } = idParamSchema.parse(req.params);

  const log = await logService.getLogById(id);

  return res.json({
    data: log,
  });
}

export async function getLogStats(req: Request, res: Response) {
  const filters = logStatFilterSchema.parse(req.query);

  const stats = await logService.getLogsStats(filters);

  return res.json({
    data: stats,
  });
}
