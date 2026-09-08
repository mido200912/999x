import mongoose from 'mongoose';

// في وضع الديمو بدون Atlas/IP whitelist — نوقف الـ buffering تماماً عشان ما يحصلش 10s timeout
mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 2000);

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/999x';
  const isAtlas = uri.includes('mongodb.net');
  if (isAtlas) {
    console.log('[999x] demo mode — Atlas detected, using mock DB (whitelist your IP at https://www.mongodb.com/docs/atlas/security-whitelist/ for real DB)');
    return;
  }
  try {
    await mongoose.connect(uri, { autoIndex: true, serverSelectionTimeoutMS: 2000, connectTimeoutMS: 2000 });
    console.log('[999x] MongoDB connected');
    await mongoose.connection.syncIndexes();
  } catch {
    console.log('[999x] MongoDB not available — running in demo mode (mock DB). Set MONGODB_URI to local mongodb://localhost:27017/999x for real DB');
    try { await mongoose.disconnect(); } catch {}
  }
}

export function isDBReady(): boolean {
  return mongoose.connection.readyState === 1;
}

export { mongoose };
