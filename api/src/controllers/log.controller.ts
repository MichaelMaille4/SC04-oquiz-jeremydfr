// src/controllers/log.controller.ts
import type { Request, Response, NextFunction } from "express";

import {
  createLog as createLogInDb,
  deleteLog,
  findLogById,
  findLogs,
  updateLog,
  type LogLevel,
} from "../services/logs.service.ts";

import { logCreateSchema } from "../services/logs.schema.ts";

function isLevel(v: unknown): v is LogLevel {
  return v === "info" || v === "warn" || v === "error";
}

export async function getAllLogs(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const logs = await findLogs();
    res.json(logs);
  } catch (err) {
    next(err);
  }
}

export async function getOneLog(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const log = await findLogById(req.params.id);
    if (!log) return res.status(404).json({ error: "Log not found" });
    res.json(log);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/logs
 * - Valide avec Zod
 * - Enrichit automatiquement:
 *   - timestamp: date courante (écrase si fourni)
 *   - environment: "development" par défaut
 * - Accepte les props non prévues grâce à .passthrough()
 */
export async function postLog(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = logCreateSchema.parse(req.body);

    const created = await createLogInDb({
      ...parsed,
      timestamp: new Date().toISOString(), // écrasé ici
      environment: parsed.environment ?? "development",
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

export async function patchLog(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const patch: any = {};
    if (req.body.message !== undefined) patch.message = req.body.message;
    if (req.body.level !== undefined) patch.level = req.body.level;
    if (req.body.context !== undefined) patch.context = req.body.context;

    if (patch.level !== undefined && !isLevel(patch.level)) {
      return res.status(400).json({ error: "level must be info|warn|error" });
    }

    const updated = await updateLog(req.params.id, patch);
    if (!updated) return res.status(404).json({ error: "Log not found" });

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function removeLog(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const ok = await deleteLog(req.params.id);
    if (!ok) return res.status(404).json({ error: "Log not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
