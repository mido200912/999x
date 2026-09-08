import type { MiddlewareHandler } from 'hono';

export const tenantIsolation: MiddlewareHandler = async (c, next) => {
  const user = c.get('user') as any;
  if (user?.role === 'CLIENT_ADMIN') {
    c.set('tenantFilter', { clientId: user.clientId });
  } else {
    c.set('tenantFilter', {});
  }
  await next();
};
