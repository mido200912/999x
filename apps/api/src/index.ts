import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { connectDB } from './infrastructure/database/connection.js';
import { authRoutes } from './presentation/routes/auth.routes.js';
import { clientRoutes } from './presentation/routes/client.routes.js';
import { aiRoutes } from './presentation/routes/ai.routes.js';
import { adminRoutes } from './presentation/routes/admin.routes.js';
import { webhookRoutes } from './presentation/routes/webhook.routes.js';

const app = new Hono();

app.use('*', logger());
app.use('*', cors({ origin: ['http://localhost:4321', 'https://999x.earth'], credentials: true }));

app.get('/health', (c) => c.json({ status: 'ok', service: '999x-api', version: '1.0.0', ts: new Date().toISOString() }));

app.route('/api/auth', authRoutes);
app.route('/api/clients', clientRoutes);
app.route('/api/ai', aiRoutes);
app.route('/api/admin', adminRoutes);
app.route('/api/webhooks', webhookRoutes);

app.onError((err, c) => {
  // لا تطبع stack كامل للـ Mongoose buffering — فقط رسالة نظيفة
  if (err.message?.includes('buffering timed out')) {
    return c.json({ success: false, error: { code: 'DB_NOT_READY', message: 'Database not connected — running in demo mock mode' } }, 503);
  }
  console.error('[999x] unhandled', err.message);
  return c.json({ success: false, error: { code: 'INTERNAL_ERROR', message: err.message } }, 500);
});

const port = Number(process.env.PORT ?? 3001);
await connectDB();

console.log(`[999x] API listening on :${port} — Neo-Cyber Executive`);
export default { port, fetch: app.fetch };
