import mongoose from 'mongoose';

// Disable buffering so DB errors surface immediately instead of hanging for 10s
mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 3000);

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/999x';
  try {
    await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log('[999x] ✅ MongoDB connected:', uri.includes('@') ? uri.split('@')[1] : 'localhost');
    await mongoose.connection.syncIndexes();
  } catch (err: any) {
    console.error('[999x] ❌ MongoDB connection FAILED:', err.message);
    console.error('[999x] ⚠️  Running in DEMO mode — data will NOT be persisted.');
    console.error('[999x] 💡 Fix: whitelist your IP at https://cloud.mongodb.com → Network Access');
    try { await mongoose.disconnect(); } catch {}
  }
}

export function isDBReady(): boolean {
  return mongoose.connection.readyState === 1;
}

export { mongoose };
