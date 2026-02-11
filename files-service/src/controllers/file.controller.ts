import type { Request, Response } from "express";
import { formParser } from "../lib/upload.ts";

export async function uploadFile(req: Request, res: Response) {
    const [fields, files] = await formParser.parse(req);

    // [['file', [{...}]], ['file', [{...}]]]
    const filesToSave = Object.entries(files)
        .map(([key, files]) => files)
        .flat();
    
    return res.json(filesToSave);
}