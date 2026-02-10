import { ObjectId } from "mongodb";
import { getClient } from "../lib/db.ts";
import type {
  createLogRequest,
  LogLevel,
  LogsQuery,
  LogsStatsQuery,
} from "../validations/logs.validation.ts";
import type { z } from "zod";
import { listLogsQuerySchema } from "../validations/logs.validation.ts";

export interface LogDocument {
  _id: ObjectId;
  timestamp: string;
  level: LogLevel;
  message: string;
  service: string;
  version?: string;
  environment: string;
  stackTrace?: string;
  userId?: string;
  requestId?: string;
  sessionId?: string;
  hostname?: string;
  ip?: string;
  userAgent?: string;
  metadata?: unknown;
}

type ListLogsQuery = z.infer<typeof listLogsQuerySchema>;

export async function createLog(data: createLogRequest) {
  const client = await getClient();
  await client.db().collection("logs").insertOne(data);
}

export async function getLogs(query: LogsQuery) {
  const client = await getClient();
  const collection = client.db().collection("logs");

  const filter: Record<string, unknown> = {};

  // 🔹 Filtres simples
  if (query.service) filter.service = query.service;
  if (query.level) filter.level = query.level;
  if (query.environment) filter.environment = query.environment;
  if (query.userId) filter.userId = query.userId;
  if (query.requestId) filter.requestId = query.requestId;
  if (query.sessionId) filter.sessionId = query.sessionId;

  // 🔹 Filtres date
  if (query.startDate || query.endDate) {
    filter.timestamp = {};
    if (query.startDate) {
      (filter.timestamp as any).$gte = query.startDate;
    }
    if (query.endDate) {
      (filter.timestamp as any).$lte = query.endDate;
    }
  }

  const total = await collection.countDocuments(filter);

  const logs = await collection
    .find(filter)
    .sort({ timestamp: -1 })
    .skip(query.offset)
    .limit(query.limit)
    .toArray();

  const hasNext = query.offset + query.limit < total;
  const hasPrevious = query.offset > 0;

  return {
    data: logs,
    pagination: {
      total,
      limit: query.limit,
      offset: query.offset,
      hasNext,
      hasPrevious,
    },
  };
}

export async function getLogById(id: string): Promise<LogDocument | null> {
  const client = await getClient();

  const log = await client
    .db()
    .collection("logs")
    .findOne<LogDocument>({ _id: new ObjectId(id) });

  if (!log) return null;

  return log;
}

export async function createManyLogs(logs: createLogRequest[]) {
  const client = await getClient();
  const result = await client
    .db()
    .collection("logs")
    .insertMany(logs, { ordered: false });
  return Object.values(result.insertedIds).map((_id) => ({ _id }));
}

export async function getLogsStats(query: LogsStatsQuery) {
  const client = await getClient();
  const collection = client.db().collection("logs");

  const { service, environment, startDate, endDate } = query;

  const match: {
    service?: string;
    environment?: string;
    timestamp?: {
      $gte?: string;
      $lte?: string;
    };
  } = {};

  if (service) match.service = service;
  if (environment) match.environment = environment;

  if (startDate || endDate) {
    match.timestamp = {};
    if (startDate) match.timestamp.$gte = startDate;
    if (endDate) match.timestamp.$lte = endDate;
  }

  const pipeline = [
    { $match: match },
    {
      $facet: {
        totalLogs: [{ $count: "count" }],

        byLevel: [{ $group: { _id: "$level", count: { $sum: 1 } } }],

        byService: [{ $group: { _id: "$service", count: { $sum: 1 } } }],

        byEnvironment: [
          { $group: { _id: "$environment", count: { $sum: 1 } } },
        ],
      },
    },
  ];

  const [result] = await collection.aggregate(pipeline).toArray();

  const toObject = (arr: any[]) =>
    Object.fromEntries(arr.map(({ _id, count }) => [_id, count]));

  return {
    totalLogs: result.totalLogs[0]?.count ?? 0,
    logCountByLevel: toObject(result.byLevel),
    logCountByService: toObject(result.byService),
    logCountByEnvironment: toObject(result.byEnvironment),
  };
}
