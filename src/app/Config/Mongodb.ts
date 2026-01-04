// lib/mongodb.ts
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Por favor, adicione MONGODB_URI ao seu arquivo .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // Em desenvolvimento, use uma variável global para preservar a conexão
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // Em produção, é seguro criar uma nova conexão
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;