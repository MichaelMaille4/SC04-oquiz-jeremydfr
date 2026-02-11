import { Router } from "express";
import { router as filessRouter } from "./files.router.ts";

export const router = Router();

router.use(filessRouter);
