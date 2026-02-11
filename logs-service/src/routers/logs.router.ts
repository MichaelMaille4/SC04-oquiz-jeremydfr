import { Router } from "express";
import { createLog, createBatchLogs, getLogs, getLogById, getLogStats } from "../controllers/log.controller.ts";

export const router = Router();

router.post('/logs', createLog);
router.get('/logs', getLogs);
router.post('/logs/batch', createBatchLogs);
router.get('/logs/stats', getLogStats);
router.get('/logs/:id', getLogById);