import { Router } from "express";
import {
  getAllLogs,
  getOneLog,
  patchLog,
  postLog,
  removeLog,
} from "../controllers/log.controller.ts";

export const router = Router();

router.get("/", getAllLogs);
router.get("/:id", getOneLog);
router.post("/", postLog);
router.patch("/:id", patchLog);
router.delete("/:id", removeLog);
