import { Hono } from 'hono';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../infrastructure/database/schemas.js';

export const authRoutes = new Hono();

const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

authRoutes.post('/login', async (c) => {
  const body = LoginSchema.parse(await c.req.json());
  const user = await UserModel.findOne({ email: body.email.toLowerCase() }).lean();
  if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } }, 401);
  }
  const accessToken = jwt.sign({ sub: String(user._id), email: user.email, role: user.role, clientId: String(user.clientId ?? '') }, process.env.JWT_SECRET ?? '999x_jwt_legendary_secret_2026_change_me', { expiresIn: '15m', algorithm: 'HS256' });
  const refreshToken = jwt.sign({ sub: String(user._id), type: 'refresh' }, process.env.JWT_SECRET ?? '999x_jwt_legendary_secret_2026_change_me', { expiresIn: '7d' });
  // HttpOnly Secure cookies (Layer 2)
  c.header('Set-Cookie', `access_token=${accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=900`);
  c.header('Set-Cookie', `refresh_token=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`, { append: true } as any);
  await UserModel.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });
  return c.json({ success: true, data: { accessToken, user: { id: String(user._id), email: user.email, fullName: user.fullName, role: user.role, clientId: user.clientId } } });
});

authRoutes.post('/register', async (c) => {
  const body = await c.req.json();
  const hash = await bcrypt.hash(body.password, 10);
  const user = await UserModel.create({ email: body.email.toLowerCase(), passwordHash: hash, fullName: body.fullName, role: body.role ?? 'CLIENT_ADMIN', clientId: body.clientId });
  return c.json({ success: true, data: { id: String(user._id) } }, 201);
});

authRoutes.post('/logout', async (c) => {
  c.header('Set-Cookie', 'access_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0');
  return c.json({ success: true, data: { ok: true } });
});
