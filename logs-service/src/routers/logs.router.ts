import { Router } from "express";
import { createLog } from "../controllers/log.controller.ts";

export const router = Router();

router.post('/logs', createLog);