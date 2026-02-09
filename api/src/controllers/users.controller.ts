import type { Request, Response } from "express";
import { prisma } from "../models/index.ts";
import z from "zod";

export async function getAllUsers(req: Request, res: Response) {
  // Query param : ?limit=5
  const { success, data } = await z.coerce.number().safeParseAsync(req.query.limit); // { success: true, data: 1 }   |   { success: false, error: ... }
  const limit = success ? data : null;

  // Appel la BDD
  const users = await prisma.user.findMany({
    omit: { password: true },
    ...(limit ? { take: limit } : {}) // Sucre syntaxique
  });

  // Réponse au client
  res.json(users);
}
