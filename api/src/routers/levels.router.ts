import { Router } from "express";
import * as levelsController from "../controllers/levels.controller.ts";
import { checkRoles } from "../middlewares/access-control.middleware.ts";

export const router = Router();

/**
 * @openapi
 * "/levels":
 *   get:
 *     tags:
 *      - "Levels"
 *     description: "Return all levels"
 *     responses:
 *       200:
 *         description: "An array of Level objects"
 *         schema:
 *           type: "array"
 *           items:
 *             $ref: "#/definitions/Level"
*/
router.get("/levels", checkRoles(["member", "author", "admin"]),levelsController.getAllLevels);

router.get("/levels/:id", checkRoles(["member", "author", "admin"]), levelsController.getOneLevel);

router.post("/levels", checkRoles(["admin"]), levelsController.createLevel);

router.patch("/levels/:id", checkRoles(["admin"]), levelsController.updateLevel);

router.delete("/levels/:id", checkRoles(["admin"]), levelsController.deleteLevel);

/** 
 * @openapi
 * definitions:
 *  Level:
 *    type: "object"
 *    properties:
 *      id:
 *        type: "number"
 *        example: 1
 *      name:
 *        type: "string"
 *        example: "Titre du niveau"
 *      created_at:
 *        type: "string"
 *        format: "date-time"
 *        example: "2022-01-01T12:00:00.000Z"
 *      updated_at:
 *        type: "string"
 *        format: "date-time"
 *        example: "2022-01-01T12:00:00.000Z"
*/
