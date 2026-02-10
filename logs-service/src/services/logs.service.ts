import { ObjectId } from "mongodb";
import { getClient } from "../lib/db.ts";
import type { createLogRequest, LogLevel } from "../validations/logs.validation.ts";

export interface LogDocument {
    _id: ObjectId,
    timestamp: Date,
    level: LogLevel,
    message: string,
    service: string,
    version: string,
    environment: string,
    stackTrace?: string
}

export async function createLog(data: createLogRequest) {
    const client = await getClient();
    await client.db().collection('logs').insertOne(data);
}

// TODO : Check Promise<LogDocument>
export async function getLogs(){
    const client = await getClient();
    
    const logs = await client.db().collection('logs').find().toArray();

    return logs;
}

export async function getLogById(id: string): Promise<LogDocument | null> {
    const client = await getClient();

    const log = await client.db().collection('logs').findOne<LogDocument>({ _id: new ObjectId(id) })

    if (!log) return null;

    return log;
}