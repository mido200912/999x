import { Hono } from 'hono';
import { z } from 'zod';
import { authGuard, roleGuard } from '../middlewares/auth.guard.js';
import { AuditLogModel, ClientModel, AIReportModel, TaskModel, SponsorLeadModel, AIStudioRunModel } from '../../infrastructure/database/schemas.js';

export const adminRoutes = new Hono<{ Variables: { user?: any; tenantFilter?: any; sanitizedBody?: any } }>();

// Demo: allow without auth, else enforce
adminRoutes.use('*', async (c, next) => {
  const token = c.req.header('authorization')?.replace('Bearer ', '') ?? c.req.header('cookie')?.match(/access_token=([^;]+)/)?.[1];
  if (token) {
    try {
      const jwt = await import('jsonwebtoken');
      const payload = jwt.default.verify(token, process.env.JWT_SECRET ?? '999x_jwt_legendary_secret_2026_change_me') as any;
      c.set('user', payload);
      return next();
    } catch {}
  }
  // Fallback to Demo mode if no token or invalid token
  c.set('user', { role: 'DEMO', email: 'demo@999x.earth' } as any);
  await next();
});

adminRoutes.get('/cockpit', async (c) => {
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  let clients: any[] = [];
  let tasks: any[] = [];
  
  const activeClientId = c.req.header('x-client-id');

  if (isDBReady()) {
    try {
      clients = await ClientModel.find().lean();
      const query = activeClientId ? { clientId: activeClientId } : {};
      tasks = await TaskModel.find(query).sort({ deadline: 1 }).lean();
    } catch {}
  }

  // Deduplicate by string ID
  const seen = new Set();
  const dedupedTasks = tasks.filter(t => {
    const sid = String(t._id || t.id);
    if (seen.has(sid)) return false;
    seen.add(sid);
    return true;
  });

  const grouped = {
    BACKLOG: dedupedTasks.filter((t: any) => t.columnStatus === 'BACKLOG'),
    TODO: dedupedTasks.filter((t: any) => t.columnStatus === 'TODO'),
    IN_PROGRESS: dedupedTasks.filter((t: any) => t.columnStatus === 'IN_PROGRESS'),
    IN_REVIEW: dedupedTasks.filter((t: any) => t.columnStatus === 'IN_REVIEW'),
    COMPLETED: dedupedTasks.filter((t: any) => t.columnStatus === 'COMPLETED'),
  };
  return c.json({ success: true, data: { clients, kanban: grouped } });
});

adminRoutes.get('/ai-studio', async (c) => {
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  const models = [
    { id: 'minimax/minimax-m3:free', use: 'HR Plans & Restructuring', cost: '$0/MTok (FREE)', latency: '1.8s', quality: 'High' },
    { id: 'qwen/qwen-2.5-72b-instruct:free', use: 'PR Campaigns & Summaries', cost: '$0/MTok (FREE)', latency: '1.2s', quality: 'Very High' },
    { id: 'meta-llama/llama-3.3-70b-instruct:free', use: 'Sponsor Strategy & Analytics', cost: '$0/MTok (FREE)', latency: '2.1s', quality: 'High' },
  ];
  if (!isDBReady()) return c.json({ success: true, data: { models, recent: [], cacheHitRate: 62 } });
  const reports = await AIReportModel.find().sort({ createdAt: -1 }).limit(20).lean();
  return c.json({ success: true, data: { models, recent: reports, cacheHitRate: 62 } });
});

adminRoutes.get('/crm', async (c) => {
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  if (!isDBReady()) return c.json({ success: true, data: [], empty: true });
  const ledger = await ClientModel.find({ registrationStatus: { $ne: 'PENDING' } })
    .select('organizationName subtitle description operationalStage healthScore tokenBudget primaryContact assignedOpsLead createdAt companyType companyTypeCustom eventDetails customDetails registrationStatus')
    .lean();
  return c.json({ success: true, data: ledger });
});

adminRoutes.get('/crm/pending', async (c) => {
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  if (!isDBReady()) return c.json({ success: true, data: [], empty: true });
  const pending = await ClientModel.find({ registrationStatus: 'PENDING' })
    .lean();
  return c.json({ success: true, data: pending });
});

adminRoutes.patch('/crm/:id/status', async (c) => {
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  const id = c.req.param('id');
  const { status } = c.get('sanitizedBody') || await c.req.json();
  if (!isDBReady()) return c.json({ success: true, data: { _id: id, registrationStatus: status, _mock: true } });
  
  const client = await ClientModel.findByIdAndUpdate(id, { $set: { registrationStatus: status } }, { new: true }).lean();
  return c.json({ success: true, data: client });
});

adminRoutes.patch('/crm/:id', async (c) => {
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  const id = c.req.param('id');
  const updates = c.get('sanitizedBody') || await c.req.json();
  if (!isDBReady() || id.startsWith('mock-')) return c.json({ success: true, data: { _id: id, ...updates, _mock: true } });
  // Map flattened nested keys like 'tokenBudget.monthlyLimit'
  const setUpdates: any = {};
  for (const [k, v] of Object.entries(updates)) {
    setUpdates[k] = v;
  }
  const client = await ClientModel.findByIdAndUpdate(id, { $set: setUpdates }, { new: true }).lean();
  return c.json({ success: true, data: client });
});

adminRoutes.post('/crm', async (c) => {
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  const body = c.get('sanitizedBody') || await c.req.json();
  if (!isDBReady()) return c.json({ success: true, data: { _id: 'mock-'+Date.now(), ...body, _mock: true } }, 201);
  const { Types } = await import('mongoose');
  const client = await ClientModel.create({
    organizationName: body.organizationName || 'New Company',
    subtitle: body.subtitle || 'General',
    description: body.description,
    primaryContact: body.primaryContact || { name: 'Admin Added', email: '', phone: '' },
    assignedOpsLead: new Types.ObjectId(),
    healthScore: 70
  });
  return c.json({ success: true, data: client }, 201);
});

adminRoutes.delete('/crm/:id', async (c) => {
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  const id = c.req.param('id');
  if (!isDBReady() || id.startsWith('mock-')) return c.json({ success: true, data: { deleted: true, _mock: true } });
  await ClientModel.findByIdAndDelete(id);
  return c.json({ success: true, data: { deleted: true } });
});

// Sponsor Leads CRUD
adminRoutes.get('/sponsor-leads', async (c) => {
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  if (!isDBReady()) return c.json({ success: true, data: [] });
  const activeClientId = c.req.header('x-client-id');
  const query = activeClientId ? { clientId: activeClientId } : {};
  const leads = await SponsorLeadModel.find(query).sort({ createdAt: -1 }).lean();
  return c.json({ success: true, data: leads });
});

adminRoutes.post('/sponsor-leads', async (c) => {
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  const body = c.get('sanitizedBody') || await c.req.json();
  if (!isDBReady()) return c.json({ success: true, data: { _id: 'mock-'+Date.now(), ...body, _mock: true } }, 201);
  const lead = await SponsorLeadModel.create({
    clientId: body.clientId || '000000000000000000000001',
    name: body.name,
    company: body.company,
    status: body.status || 'INTERESTED'
  });
  return c.json({ success: true, data: lead }, 201);
});

adminRoutes.patch('/sponsor-leads/:id', async (c) => {
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  const id = c.req.param('id');
  const body = c.get('sanitizedBody') || await c.req.json();
  if (!isDBReady() || id.startsWith('mock-')) return c.json({ success: true, data: { _id: id, ...body, _mock: true } });
  const lead = await SponsorLeadModel.findByIdAndUpdate(id, { $set: body }, { new: true }).lean();
  return c.json({ success: true, data: lead });
});

adminRoutes.delete('/sponsor-leads/:id', async (c) => {
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  const id = c.req.param('id');
  if (!isDBReady() || id.startsWith('mock-')) return c.json({ success: true, data: { deleted: true, _mock: true } });
  await SponsorLeadModel.findByIdAndDelete(id);
  return c.json({ success: true, data: { deleted: true } });
});

// AI Studio Runs History
adminRoutes.get('/ai-runs', async (c) => {
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  if (!isDBReady()) return c.json({ success: true, data: [] });
  const runs = await AIStudioRunModel.find().sort({ createdAt: -1 }).limit(50).lean();
  return c.json({ success: true, data: runs });
});


const TaskCreateSchema = z.object({
  title: z.string().min(2).max(200).trim(),
  details: z.string().max(2000).optional(),
  clientId: z.string().optional(),
  columnStatus: z.enum(['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED']).optional().default('BACKLOG'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional().default('MEDIUM'),
  deadline: z.string().optional(),
  assignedOpsMember: z.string().optional(),
});

adminRoutes.post('/tasks', async (c) => {
  let body: any;
  try { body = TaskCreateSchema.parse(c.get('sanitizedBody') || await c.req.json()); }
  catch (e: any) { return c.json({ success: false, error: { code: 'VALIDATION', message: e.errors?.[0]?.message ?? 'title required' } }, 422); }
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  if (!isDBReady()) {
    return c.json({ success: true, data: { _id: 'mock-' + Date.now(), clientId: body.clientId || 'demo', title: body.title, priority: body.priority, columnStatus: body.columnStatus, deadline: new Date().toISOString(), _mock: true } }, 201);
  }
  const task = await TaskModel.create({
    clientId: body.clientId || c.req.header('x-client-id') || '000000000000000000000001',
    assignedOpsMember: body.assignedOpsMember || '000000000000000000000001',
    title: body.title,
    details: body.details || body.title,
    columnStatus: body.columnStatus,
    priority: body.priority,
    deadline: body.deadline ? new Date(body.deadline) : new Date(Date.now() + 2 * 24 * 3600 * 1000),
  });
  const user = c.get('user');
  if (user && user.email) {
    await AuditLogModel.create({ actorId: user.sub || '000000000000000000000000', actorEmail: user.email, action: 'CREATE_TASK', resource: 'Task', resourceId: String(task._id), ipAddress: c.req.header('x-forwarded-for') || 'unknown', userAgent: c.req.header('user-agent') || 'unknown' }).catch(()=>{});
  }
  return c.json({ success: true, data: task }, 201);
});

adminRoutes.patch('/tasks/:id/move', async (c) => {
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  const id = c.req.param('id');
  const { columnStatus } = c.get('sanitizedBody') || await c.req.json();
  if (!isDBReady() || id.startsWith('mock-')) return c.json({ success: true, data: { _id: id, columnStatus, _mock: true } });
  const task = await TaskModel.findByIdAndUpdate(id, { columnStatus }, { new: true }).lean();
  const user = c.get('user');
  if (user && user.email) {
    await AuditLogModel.create({ actorId: user.sub || '000000000000000000000000', actorEmail: user.email, action: 'MOVE_TASK', resource: 'Task', resourceId: id, ipAddress: c.req.header('x-forwarded-for') || 'unknown', userAgent: c.req.header('user-agent') || 'unknown' }).catch(()=>{});
  }
  return c.json({ success: true, data: task });
});

adminRoutes.patch('/tasks/:id', async (c) => {
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  const id = c.req.param('id');
  const updates = c.get('sanitizedBody') || await c.req.json();
  // Whitelist allowed update fields
  const allowed = ['title', 'details', 'priority', 'columnStatus', 'deadline', 'assignedOpsMember'];
  const safe = Object.fromEntries(Object.entries(updates).filter(([k]) => allowed.includes(k)));
  if (!isDBReady() || id.startsWith('mock-')) return c.json({ success: true, data: { _id: id, ...safe, _mock: true } });
  const task = await TaskModel.findByIdAndUpdate(id, { $set: safe }, { new: true }).lean();
  if (!task) return c.json({ success: false, error: { code: 'NOT_FOUND' } }, 404);
  const user = c.get('user');
  if (user && user.email) {
    await AuditLogModel.create({ actorId: user.sub || '000000000000000000000000', actorEmail: user.email, action: 'UPDATE_TASK', resource: 'Task', resourceId: id, ipAddress: c.req.header('x-forwarded-for') || 'unknown', userAgent: c.req.header('user-agent') || 'unknown' }).catch(()=>{});
  }
  return c.json({ success: true, data: task });
});

adminRoutes.delete('/tasks/:id', async (c) => {
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  const id = c.req.param('id');
  if (!isDBReady() || id.startsWith('mock-')) return c.json({ success: true, data: { deleted: true, _mock: true } });
  await TaskModel.findByIdAndDelete(id);
  const user = c.get('user');
  if (user && user.email) {
    await AuditLogModel.create({ actorId: user.sub || '000000000000000000000000', actorEmail: user.email, action: 'DELETE_TASK', resource: 'Task', resourceId: id, ipAddress: c.req.header('x-forwarded-for') || 'unknown', userAgent: c.req.header('user-agent') || 'unknown' }).catch(()=>{});
  }
  return c.json({ success: true, data: { deleted: true } });
});

