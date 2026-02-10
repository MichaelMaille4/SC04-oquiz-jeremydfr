import type { Request, Response } from "express";
import { createLogSchema } from "../validations/logs.validation.ts";
import * as logService from "../services/logs.service.ts";

export async function createLog(req: Request, res: Response) {
    const logData = createLogSchema.parse(req.body);

    await logService.createLog(logData);

    return res.status(201).json({
        message: 'Log créé avec succès'
    });
}