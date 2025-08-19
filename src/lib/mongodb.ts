import { MongoClient, Db } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}

const dbName = process.env.MONGODB_DB || "kickedout";

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global.__mongoClientPromise) {
    const client = new MongoClient(uri);
    global.__mongoClientPromise = client.connect();
  }
  clientPromise = global.__mongoClientPromise as Promise<MongoClient>;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise;
}

let initialized = false;

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  const db = client.db(dbName);

  // Initialize indexes once
  if (!initialized) {
    initialized = true;
    // Ensure unique email index for users collection
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
  }

  return db;
}


