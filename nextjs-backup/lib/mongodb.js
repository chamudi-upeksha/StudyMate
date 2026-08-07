import mongoose from 'mongoose';
import dns from 'dns';
import { URL } from 'url';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

console.log('lib/mongodb.js loaded with MONGODB_URI prefix:',
  MONGODB_URI.startsWith('mongodb+srv://') ? 'mongodb+srv' :
  MONGODB_URI.startsWith('mongodb://') ? 'mongodb' :
  'other');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function resolveSrvHosts(hostname) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (error) {
    console.warn('Unable to set DNS servers for SRV lookup:', error);
  }

  const records = await dns.promises.resolveSrv(`_mongodb._tcp.${hostname}`);
  return records.map((record) => `${record.name}:${record.port}`);
}

async function getMongoUri() {
  if (!MONGODB_URI.startsWith('mongodb+srv://')) {
    return MONGODB_URI;
  }

  const url = new URL(MONGODB_URI);
  const hosts = await resolveSrvHosts(url.hostname);

  const auth = url.username
    ? `${encodeURIComponent(url.username)}:${encodeURIComponent(url.password)}@`
    : '';

  const params = new URLSearchParams(url.searchParams);
  if (!params.has('tls') && !params.has('ssl')) {
    params.set('tls', 'true');
  }
  if (!params.has('authSource')) {
    params.set('authSource', 'admin');
  }
  if (!params.has('retryWrites')) {
    params.set('retryWrites', 'true');
  }
  if (!params.has('w')) {
    params.set('w', 'majority');
  }

  return `mongodb://${auth}${hosts.join(',')}${url.pathname}?${params.toString()}`;
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = getMongoUri().then((uri) => mongoose.connect(uri, opts)).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
