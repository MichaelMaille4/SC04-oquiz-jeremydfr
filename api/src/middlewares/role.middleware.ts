import type { NextFunction, Response } from "express";
import type { Role } from "../models/index.ts";
import { ForbiddenError } from "../lib/errors.ts";
import type { AuthenticatedRequest } from "../@types/express.js";
import { logger } from "../lib/log.ts";

export function checkRoles(roles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const role = req.userRole;

    if (!roles.includes(role)) {
      logger.info("Vous n'avez pas la permission", { user_id: req.userId, role: req.userRole });
      throw new ForbiddenError("Vous n'avez pas la permission");
    }

    next();
  };
}