import type { MiddlewareHandler } from 'hono';

type Vars = { user?: any; tenantFilter?: any };
export const tenantIsolation: MiddlewareHandler<{ Variables: Vars }> = async (c, next) => {
  const user = c.get('user') as any;
  if (user?.role === 'CLIENT_ADMIN') {
    c.set('tenantFilter', { clientId: user.clientId });
  } else {
    c.set('tenantFilter', {});
  }
  await next();
};
