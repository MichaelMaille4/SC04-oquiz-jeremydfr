import { ObjectId } from "mongodb";
import { getCollection } from "../lib/db.ts";
import { logCreateSchema } from "./logs.schema.ts";
import { z } from "zod";

export type LogLevel = "info" | "warn" | "error";

export interface LogDoc {
  _id?: ObjectId;
  message: string;
  level: LogLevel;
  service: string;

  version?: string;
  environment?: string;

  userId?: string;
  requestId?: string;
  sessionId?: string;

  hostname?: string;
  ip?: string;
  userAgent?: string;

  metadata?: Record<string, unknown>;
  stackTrace?: string;
  timestamp?: string;

  createdAt: Date;
  updatedAt: Date;

  // champs passthrough
  [key: string]: unknown;
}

const COLLECTION = "logs";

// ✅ Le type vient du schema (pas d'import de type)
type LogCreateInput = z.infer<typeof logCreateSchema>;

export async function createLog(input: LogCreateInput) {
  const col = await getCollection<LogDoc>(COLLECTION);

  const now = new Date();

  // règles du challenge :
  // - timestamp auto (on ignore celui fourni)
  // - environment défaut development
  const doc: LogDoc = {
    ...input,
    timestamp: new Date().toISOString(),
    environment: input.environment ?? "development",
    createdAt: now,
    updatedAt: now,
  };

  const result = await col.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function findLogs() {
  const col = await getCollection<LogDoc>(COLLECTION);
  return col.find().sort({ createdAt: -1 }).toArray();
}

export async function findLogById(id: string) {
  const col = await getCollection<LogDoc>(COLLECTION);
  return col.findOne({ _id: new ObjectId(id) });
}

export async function updateLog(
  id: string,
  patch: Partial<Pick<LogDoc, "message" | "level" | "metadata" | "stackTrace">>,
) {
  const col = await getCollection<LogDoc>(COLLECTION);

  const result = await col.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...patch, updatedAt: new Date() } },
    { returnDocument: "after" },
  );

  return result.value;
}

export async function deleteLog(id: string) {
  const col = await getCollection<LogDoc>(COLLECTION);
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
