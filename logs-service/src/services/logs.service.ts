import { ObjectId } from "mongodb";
import { getClient } from "../lib/db.ts";
import type { CreateLogRequest, LogLevel, LogFilterRequest, LogStatFilterRequest } from "../validations/logs.validation.ts";

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

export async function createLog(data: CreateLogRequest) {
    const client = await getClient();
    await client.db().collection('logs').insertOne(data);
}

// TODO : Create type for getLogs return (LogsWithPagination)
export async function getLogs(filters: LogFilterRequest) {
    const client = await getClient();
    const collection = client.db().collection('logs');

    // TODO : Create an interface
    const mongoFilter: any = {};

    if (filters.service) mongoFilter.service = filters.service;
    if (filters.level) mongoFilter.level = filters.level;
    if (filters.environment) mongoFilter.environment = filters.environment;
    if (filters.userId) mongoFilter.userId = filters.userId;
    if (filters.requestId) mongoFilter.requestId = filters.requestId;
    if (filters.sessionId) mongoFilter.sessionId = filters.sessionId;

    if (filters.startDate || filters.endDate) {
        mongoFilter.timestamp = {};
        if (filters.startDate) mongoFilter.timestamp.$gte = filters.startDate;
        if (filters.endDate) mongoFilter.timestamp.$lte = filters.endDate;
    }

    // Execution des requêtes en parralèle avec Promise.all()
    const [logs, total] = await Promise.all([
        collection.find<LogDocument>(mongoFilter).skip(filters.offset).limit(filters.limit).toArray(),
        collection.countDocuments(mongoFilter)
    ]);

    return {
        logs,
        pagination: {
            total: total,
            limit: filters.limit,
            offset: filters.offset
        }
    }
}

export async function getLogById(id: string): Promise<LogDocument | null> {
    const client = await getClient();

    const log = await client.db().collection('logs').findOne<LogDocument>({ _id: new ObjectId(id) })

    if (!log) return null;

    return log;
}

export async function createBatchLogs(logs: CreateLogRequest[]) {
    const client = await getClient();

    const logsData = await client.db().collection('logs').insertMany(logs);

    return logsData;
}

export async function getLogStats(filters: LogStatFilterRequest) {
    const client = await getClient();
    const collection = client.db().collection('logs');

    // TODO : Create an interface
    const mongoFilter: any = {};

    if (filters.service) mongoFilter.service = filters.service;
    if (filters.environment) mongoFilter.environment = filters.environment;

    if (filters.startDate || filters.endDate) {
        mongoFilter.timestamp = {};
        if (filters.startDate) mongoFilter.timestamp.$gte = filters.startDate;
        if (filters.endDate) mongoFilter.timestamp.$lte = filters.endDate;
    }

    const [totalLogs, logsByLevel, logsByService, logsByEnvironment] = await Promise.all([
        collection.countDocuments(mongoFilter),
        // Répartition par niveau 
        // [
        //     { _id: "info", count: 100 },
        //     { _id: "error", count: 75 }
        // ]
        collection.aggregate([{ $match: mongoFilter }, { $group: { _id: '$level', count: { $sum: 1 } } }]).toArray(),
        // Répartition par service
        collection.aggregate([{ $match: mongoFilter }, { $group: { _id: '$service', count: { $sum: 1 } } }]).toArray(),
        // Répartition par environnement
        collection.aggregate([{ $match: mongoFilter }, { $group: { _id: '$environment', count: { $sum: 1 } } }]).toArray()
    ]);

    return {
        totalLogs,
        logCountByLevel: logsByLevel.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc
        }, {} as Record<string, number>),
        logCountByService: logsByService.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc
        }, {} as Record<string, number>),
        logCountByEnvironment: logsByEnvironment.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc
        }, {} as Record<string, number>)
    }
}