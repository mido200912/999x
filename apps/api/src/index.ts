import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { connectDB } from './infrastructure/database/connection.js';
import { authRoutes } from './presentation/routes/auth.routes.js';
import { clientRoutes } from './presentation/routes/client.routes.js';
import { aiRoutes } from './presentation/routes/ai.routes.js';
import { adminRoutes } from './presentation/routes/admin.routes.js';
import { webhookRoutes } from './presentation/routes/webhook.routes.js';
import { auditRoutes } from './presentation/routes/audit.routes.js';
import { prospectsRoutes } from './presentation/routes/prospects.routes.js';
import { devRoutes } from './presentation/routes/dev.routes.js';

type Variables = { user?: any; tenantFilter?: any };
const app = new Hono<{ Variables: Variables }>();

const isProd = process.env.NODE_ENV === 'production';

// ─── Layer 1: Global Security Headers (WAF-Level) ────────────────────────────
app.use('*', secureHeaders({
  xFrameOptions: 'DENY',
  xContentTypeOptions: 'nosniff',
  strictTransportSecurity: isProd ? 'max-age=31536000; includeSubDomains; preload' : undefined,
  referrerPolicy: 'strict-origin-when-cross-origin',
  // CSP only in prod — in dev the Vite proxy handles routing
  ...(isProd ? {
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://openrouter.ai"],
      scriptSrc: ["'none'"],
      frameAncestors: ["'none'"],
    },
    // COEP/CORP cause cross-origin issues between Vite dev (4321) and API (3001)
    crossOriginEmbedderPolicy: 'require-corp' as const,
    crossOriginOpenerPolicy: 'same-origin' as const,
    crossOriginResourcePolicy: 'same-origin' as const,
  } : {}),
}));

app.use('*', async (c, next) => {
  await next();
  c.res.headers.delete('X-Powered-By');
  c.res.headers.set('Server', '999x');
  c.res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
});

// ─── Logging ─────────────────────────────────────────────────────────────────
app.use('*', logger());

// ─── Layer 1: CORS Whitelist ──────────────────────────────────────────────────
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173,http://localhost:4321,https://999x.earth').split(',').map(o => o.trim());
app.use('*', cors({
  origin: (origin) => ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-client-id'],
  credentials: true,
  maxAge: 600,
}));

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (c) => c.json({
  status: 'ok',
  service: '999x-api',
  version: '1.0.0',
  ts: new Date().toISOString(),
  security: 'Neo-Cyber Executive Shield v2'
}));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.route('/api/auth', authRoutes);
app.route('/api/clients', clientRoutes);
app.route('/api/ai', aiRoutes);
app.route('/api/admin', adminRoutes);
app.route('/api/admin', auditRoutes);
app.route('/api/prospects', prospectsRoutes);
app.route('/api/dev', devRoutes);
app.route('/api/webhooks', webhookRoutes);

// ─── Global Error Handler (never leak internals) ──────────────────────────────
app.onError((err, c) => {
  if (err.message?.includes('buffering timed out')) {
    return c.json({ success: false, error: { code: 'DB_NOT_READY', message: 'Database not connected — running in demo mock mode' } }, 503);
  }
  // In production: log to monitoring but NEVER expose stack to client
  console.error('[999x] unhandled error:', isProd ? err.name : err.stack || err.message);
  
  // Sanitized generic error response
  return c.json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An internal error occurred. Our team has been notified.',
    }
  }, 500);
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.notFound((c) => c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } }, 404));

const port = Number(process.env.PORT ?? 3001);
await connectDB();

console.log(`[999x] API :${port} — Neo-Cyber Executive Shield ACTIVE`);
export default { port, fetch: app.fetch };
