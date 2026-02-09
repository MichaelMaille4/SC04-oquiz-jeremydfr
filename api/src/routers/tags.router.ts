import { Router } from "express";
import * as tagsController from "../controllers/tags.controller.ts";
import { checkRoles } from "../middlewares/access-control.middleware.ts";

export const router = Router();

router.get("/tags", checkRoles(["member", "author", "admin"]), tagsController.getAllTags);
router.get("/tags/:id", checkRoles(["member", "author", "admin"]), tagsController.getOneTag);
router.post("/tags", checkRoles(["author", "admin"]), tagsController.createTag);
router.patch("/tags/:id", checkRoles(["author", "admin"]), tagsController.updateTag);
router.delete("/tags/:id", checkRoles(["author", "admin"]), tagsController.deleteTag);