import type { Request, Response } from "express";
import path from "node:path";
import fs from "node:fs/promises";
import type formidable from "formidable";
import { formParser, uploadDir } from "../lib/upload.ts";
import * as filesService from "../services/files.service.ts";

export async function uploadFile(req: Request, res: Response) {
  const [_fields, files] = await formParser.parse(req);

  const filesToSave = Object.values(files)
    .flat()
    .filter((f): f is formidable.File => Boolean(f));

  if (filesToSave.length === 0) {
    return res
      .status(400)
      .json({ error: "Aucun fichier reçu (champ 'file')." });
  }

  const created = await Promise.all(
    filesToSave.map((f) =>
      filesService.createFile({
        size: Number(f.size),
        newFilename: String(f.newFilename),
        originalFilename: String(f.originalFilename),
        mimetype: String(f.mimetype),
      }),
    ),
  );

  return res.status(201).json(
    created.map((c) => ({
      id: c.id,
      originalFilename: c.originalFilename,
      newFilename: c.newFilename,
      mimetype: c.mimetype,
      size: c.size,
      createdAt: c.createdAt,
    })),
  );
}

export async function getFileById(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "id invalide" });
  }

  const file = await filesService.findFileById(id);
  if (!file) {
    return res.status(404).json({ error: "Fichier introuvable" });
  }

  // newFilename ressemble à "2026/2/11/xxxx.png"
  const filePath = path.join(uploadDir, file.newFilename);

  try {
    await fs.access(filePath);
  } catch {
    return res.status(404).json({ error: "Fichier manquant sur le disque" });
  }

  res.setHeader("Content-Type", file.mimetype);

  // Optionnel : force le téléchargement (sinon le navigateur peut afficher l'image/pdf)
  // res.setHeader(
  //   "Content-Disposition",
  //   `attachment; filename="${file.originalFilename}"`
  // );

  return res.sendFile(filePath);
}
