import { Hono } from 'hono';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel, AuditLogModel } from '../../infrastructure/database/schemas.js';
import { sanitizeBody } from '../middlewares/sanitize.js';

export const authRoutes = new Hono();
authRoutes.use('*', sanitizeBody);

const JWT_SECRET = process.env.JWT_SECRET ?? '999x_jwt_legendary_secret_2026_CHANGE_IN_PROD';
const BCRYPT_ROUNDS = 12;

const LoginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
});

const RegisterSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
  fullName: z.string().min(2).max(100).trim(),
  role: z.enum(['SUPER_ADMIN', 'OPS_MEMBER', 'CLIENT_ADMIN']).optional().default('CLIENT_ADMIN'),
  clientId: z.string().optional(),
});

async function writeAudit(actorId: string, actorEmail: string, action: string, resource: string, ip: string, ua: string, resourceId?: string) {
  try {
    const { isDBReady } = await import('../../infrastructure/database/connection.js');
    if (!isDBReady()) return;
    await AuditLogModel.create({ actorId, actorEmail, action, resource, resourceId, ipAddress: ip, userAgent: ua });
  } catch {}
}

authRoutes.post('/login', async (c) => {
  const ip = c.req.header('x-forwarded-for') ?? 'unknown';
  const ua = c.req.header('user-agent') ?? 'unknown';
  let body: any;
  try { body = LoginSchema.parse(await c.req.json()); }
  catch (e: any) {
    return c.json({ success: false, error: { code: 'VALIDATION', message: e.errors?.[0]?.message ?? 'Invalid input' } }, 422);
  }
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  // Demo mode — works without DB
  if (!isDBReady()) {
    if (body.email === 'demo@999x.earth' && body.password === 'password1234') {
      const token = jwt.sign({ sub: 'demo', email: body.email, role: 'SUPER_ADMIN', clientId: '' }, JWT_SECRET, { expiresIn: '15m' });
      c.header('Set-Cookie', `access_token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900`);
      return c.json({ success: true, data: { accessToken: token, user: { id: 'demo', email: body.email, fullName: 'Demo Admin', role: 'SUPER_ADMIN' } } });
    }
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } }, 401);
  }
  const user = await UserModel.findOne({ email: body.email.toLowerCase() }).lean();
  if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) {
    await writeAudit('000000000000000000000000', body.email, 'LOGIN_FAILED', 'User', ip, ua);
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } }, 401);
  }
  if (!user.isActive) return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'Account deactivated' } }, 403);
  const accessToken = jwt.sign(
    { sub: String(user._id), email: user.email, role: user.role, clientId: String(user.clientId ?? '') },
    JWT_SECRET, { expiresIn: '15m', algorithm: 'HS256' }
  );
  const refreshToken = jwt.sign({ sub: String(user._id), type: 'refresh' }, JWT_SECRET, { expiresIn: '7d' });
  c.header('Set-Cookie', `access_token=${accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900`);
  c.header('Set-Cookie', `refresh_token=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/api/auth; Max-Age=604800`, { append: true } as any);
  await UserModel.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });
  await writeAudit(String(user._id), user.email, 'LOGIN_SUCCESS', 'User', ip, ua, String(user._id));
  return c.json({ success: true, data: { accessToken, user: { id: String(user._id), email: user.email, fullName: user.fullName, role: user.role, clientId: user.clientId } } });
});

// Refresh Token Rotation (999x.md §6-ب)
authRoutes.post('/refresh', async (c) => {
  const cookieHeader = c.req.header('cookie') ?? '';
  const match = cookieHeader.match(/refresh_token=([^;]+)/);
  if (!match) return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'No refresh token' } }, 401);
  try {
    const payload = jwt.verify(match[1], JWT_SECRET) as any;
    if (payload.type !== 'refresh') throw new Error('Not a refresh token');
    const { isDBReady } = await import('../../infrastructure/database/connection.js');
    let role = 'CLIENT_ADMIN', email = payload.email ?? '', clientId = '';
    if (isDBReady()) {
      const user = await UserModel.findById(payload.sub).lean();
      if (!user || !user.isActive) return c.json({ success: false, error: { code: 'UNAUTHORIZED' } }, 401);
      role = user.role; email = user.email; clientId = String(user.clientId ?? '');
    }
    const accessToken = jwt.sign({ sub: payload.sub, email, role, clientId }, JWT_SECRET, { expiresIn: '15m' });
    const newRefresh = jwt.sign({ sub: payload.sub, type: 'refresh' }, JWT_SECRET, { expiresIn: '7d' });
    c.header('Set-Cookie', `access_token=${accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900`);
    c.header('Set-Cookie', `refresh_token=${newRefresh}; HttpOnly; Secure; SameSite=Strict; Path=/api/auth; Max-Age=604800`, { append: true } as any);
    return c.json({ success: true, data: { accessToken } });
  } catch {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid or expired refresh token' } }, 401);
  }
});

authRoutes.post('/register', async (c) => {
  let body: any;
  try { body = RegisterSchema.parse(await c.req.json()); }
  catch (e: any) {
    return c.json({ success: false, error: { code: 'VALIDATION', message: e.errors?.[0]?.message ?? 'Invalid input' } }, 422);
  }
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  if (!isDBReady()) return c.json({ success: true, data: { id: 'mock-' + Date.now(), _mock: true } }, 201);
  const existing = await UserModel.findOne({ email: body.email.toLowerCase() }).lean();
  if (existing) return c.json({ success: false, error: { code: 'CONFLICT', message: 'Email already registered' } }, 409);
  const hash = await bcrypt.hash(body.password, BCRYPT_ROUNDS);
  const user = await UserModel.create({ email: body.email.toLowerCase(), passwordHash: hash, fullName: body.fullName, role: body.role, clientId: body.clientId });
  const ip = c.req.header('x-forwarded-for') ?? 'unknown';
  await writeAudit(String(user._id), user.email, 'REGISTER', 'User', ip, c.req.header('user-agent') ?? '', String(user._id));
  return c.json({ success: true, data: { id: String(user._id) } }, 201);
});

authRoutes.post('/logout', async (c) => {
  const ip = c.req.header('x-forwarded-for') ?? 'unknown';
  await writeAudit('000000000000000000000000', 'logout', 'LOGOUT', 'User', ip, c.req.header('user-agent') ?? '');
  c.header('Set-Cookie', 'access_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0');
  c.header('Set-Cookie', 'refresh_token=; HttpOnly; Secure; SameSite=Strict; Path=/api/auth; Max-Age=0', { append: true } as any);
  return c.json({ success: true, data: { ok: true } });
});
