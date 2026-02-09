import path from "node:path";

import { Router } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { router as authRouter } from "./auth.router.ts";
import { router as levelsRouter } from "./levels.router.ts";
import { router as usersRouter } from "./users.router.ts";
import { router as tagsRouter } from "./tags.router.ts";
import { router as logsRouter } from "./logs.router.ts";

export const router = Router();

router.use(authRouter);
router.use(levelsRouter);
router.use(usersRouter);
router.use(tagsRouter);
router.use("/logs", logsRouter);

// Documentation swagger
const spec = swaggerJsdoc({
  definition: {
    info: {
      title: "Oquiz",
      version: "1.0.0",
    },
    basePath: "/api",
  },
  apis: [path.join(import.meta.dirname, "*.router.ts")],
});
router.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));
