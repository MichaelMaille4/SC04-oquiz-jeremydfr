import { Router } from "express";
import {
  createLog,
  createLogsBatch,
  getLogs,
  getLogById,
  getLogsStats,
} from "../controllers/log.controller.ts";

export const router = Router();

router.get("/logs/stats", getLogsStats);
router.get("/logs", getLogs);
router.get("/logs/:id", getLogById);

router.post("/logs", createLog);
router.post("/logs/batch", createLogsBatch);
