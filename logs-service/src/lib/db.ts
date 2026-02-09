import { MongoClient } from "mongodb";
import { config } from "../../config.ts";

let cachedClient: MongoClient | null = null

export async function getClient() {
    if (cachedClient) return cachedClient;

    const url = config.databaseUrl;
    const client = new MongoClient(url);

    await client.connect();

    cachedClient = client;

    return client;
}

export async function closeClient() {
    if (cachedClient) {
        await cachedClient.close();
        cachedClient = null;
    }
}