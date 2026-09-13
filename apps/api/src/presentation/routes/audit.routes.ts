import { Hono } from 'hono';
import { authGuard } from '../middlewares/auth.guard.js';
import { roleGuard } from '../middlewares/auth.guard.js';
import { AuditLogModel } from '../../infrastructure/database/schemas.js';

export const auditRoutes = new Hono<{ Variables: { user: any } }>();

// All audit routes require authentication and SUPER_ADMIN role
auditRoutes.use('*', authGuard);
auditRoutes.use('*', roleGuard(['SUPER_ADMIN']));

/**
 * GET /api/admin/audit
 * Fetches the audit log, ordered by newest first.
 * Supports basic pagination via query parameters (page, limit).
 */
auditRoutes.get('/audit', async (c) => {
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  if (!isDBReady()) {
    // Return mock data for demo mode
    return c.json({
      success: true,
      data: {
        logs: [
          {
            _id: 'mock-1',
            actorEmail: 'demo@999x.earth',
            action: 'LOGIN_SUCCESS',
            resource: 'User',
            ipAddress: '127.0.0.1',
            userAgent: 'Mozilla/5.0',
            timestamp: new Date().toISOString(),
          }
        ],
        total: 1,
        page: 1,
        limit: 50
      }
    });
  }

  const page = Math.max(1, parseInt(c.req.query('page') || '1'));
  const limit = Math.max(1, Math.min(100, parseInt(c.req.query('limit') || '50')));
  const skip = (page - 1) * limit;

  try {
    const logs = await AuditLogModel.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await AuditLogModel.countDocuments();

    return c.json({
      success: true,
      data: {
        logs,
        total,
        page,
        limit
      }
    });
  } catch (error) {
    console.error('[Audit API] Error fetching audit logs:', error);
    return c.json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch audit logs' }
    }, 500);
  }
});
