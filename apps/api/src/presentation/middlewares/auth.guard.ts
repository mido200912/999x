import type { MiddlewareHandler } from 'hono';
import jwt from 'jsonwebtoken';

type Vars = { user?: any; tenantFilter?: any };
export const authGuard: MiddlewareHandler<{ Variables: Vars }> = async (c, next) => {
  const token = c.req.header('authorization')?.replace('Bearer ', '') ?? c.req.header('cookie')?.match(/access_token=([^;]+)/)?.[1];
  if (!token) return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Missing token' } }, 401);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET ?? '999x_jwt_legendary_secret_2026_change_me') as any;
    c.set('user', payload);
    await next();
  } catch {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid token' } }, 401);
  }
};

export const roleGuard = (roles: string[]): MiddlewareHandler<{ Variables: Vars }> => async (c, next) => {
  const user = c.get('user') as any;
  if (!user || !roles.includes(user.role)) return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'Insufficient role' } }, 403);
  await next();
};
