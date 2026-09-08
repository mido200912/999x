import Redis from 'ioredis';

const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
// في الديمو لو مفيش Redis — لا تحاول الاتصال ولا تطبع spam كل ثانية
const isDemoNoRedis = !process.env.REDIS_URL;
export const redis = new Redis(url, { 
  maxRetriesPerRequest: 1, 
  lazyConnect: true,
  enableReadyCheck: false,
  retryStrategy: () => isDemoNoRedis ? null : 2000,
});

if (!isDemoNoRedis) {
  redis.on('connect', () => console.log('[999x] Redis connecting'));
  redis.on('ready', () => console.log('[999x] Redis ready'));
  redis.on('error', (e) => console.error('[999x] Redis error', e.message));
} else {
  // اكتم الـ error spam في الديمو
  redis.on('error', () => {});
}

// Two-tier: L1 DB cache + L2 Semantic AI cache — with fallback if Redis unavailable
export async function getSemanticCache(hash: string): Promise<string | null> {
  try{ return await redis.get(`ai:sem:${hash}`); }catch{ return null; }
}
export async function setSemanticCache(hash: string, value: string, ttlSec = 14 * 24 * 3600): Promise<void> {
  try{ await redis.set(`ai:sem:${hash}`, value, 'EX', ttlSec); }catch{}
}
export async function getQueryCache(key: string): Promise<string | null> { try{ return await redis.get(`q:${key}`);}catch{ return null; } }
export async function setQueryCache(key: string, val: string, ttlSec = 120): Promise<void> { try{ await redis.set(`q:${key}`, val, 'EX', ttlSec);}catch{} }
