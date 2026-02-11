import { Router } from "express";
import { uploadFile, getFileById } from "../controllers/file.controller.ts";

export const router = Router();

router.post("/files", uploadFile);
router.get("/files/:id", getFileById);
