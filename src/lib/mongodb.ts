import { MongoClient } from 'mongodb'

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

const uri = process.env.MONGODB_URI || process.env.NEXT_PUBLIC_MONGODB_URI

let client: MongoClient | undefined
let clientPromise: Promise<MongoClient> | undefined

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri)
      // store the promise on the global so that it can be reused across module reloads
      global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
  } else {
    client = new MongoClient(uri)
    clientPromise = client.connect()
  }
}

export async function connectToDatabase() {
  if (!clientPromise) {
    throw new Error('MONGODB_URI is not configured. Skipping DB connection.')
  }
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB || undefined)
  return { client, db }
}

export default connectToDatabase
