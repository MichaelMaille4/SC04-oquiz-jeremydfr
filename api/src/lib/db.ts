import { MongoClient, type Db, type Collection } from "mongodb";
import { config } from "../../config.ts";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectMongo(): Promise<Db> {
  if (db) return db;

  if (!config.mongoUrl) {
    throw new Error("Missing config.mongoUrl (MongoDB connection string)");
  }
  if (!config.mongoDbName) {
    throw new Error("Missing config.mongoDbName (MongoDB database name)");
  }

  client = new MongoClient(config.mongoUrl);
  await client.connect();

  db = client.db(config.mongoDbName);
  return db;
}

export async function getCollection<T extends object>(
  name: string,
): Promise<Collection<T>> {
  const database = await connectMongo();
  return database.collection<T>(name);
}

export async function closeMongo(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
