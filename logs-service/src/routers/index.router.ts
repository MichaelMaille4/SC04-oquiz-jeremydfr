import { Router } from "express";
import { router as logsRouter } from "./logs.router.ts"

export const router = Router();

router.use(logsRouter);