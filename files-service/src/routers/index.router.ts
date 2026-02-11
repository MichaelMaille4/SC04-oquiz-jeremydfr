import { Router } from "express";
import { router as logsRouter } from "./files.router.ts"

export const router = Router();

router.use(logsRouter);