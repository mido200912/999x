import { Hono } from 'hono';
import { ClientModel, SubmissionModel } from '../../infrastructure/database/schemas.js';
import { authGuard, roleGuard } from '../middlewares/auth.guard.js';
import { tenantIsolation } from '../middlewares/tenant-isolation.js';
import { HealthScore } from '../../core/value-objects/health-score.vo.js';

export const clientRoutes = new Hono();

// Public: register client (no auth) — used by onboarding wizard
clientRoutes.post('/register', async (c) => {
  const body = await c.req.json();
  if(!body.organizationName || !body.category || !body.primaryContact?.email){
    return c.json({ success:false, error:{ code:'VALIDATION', message:'organizationName, category, primaryContact.email required' } }, 422);
  }
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  if (!isDBReady()) {
    const mockId = 'CLI-' + Date.now().toString(36).toUpperCase();
    return c.json({ success: true, data: { id: mockId, healthScore: 70, _mock:true, demo:true } }, 201);
  }
  const client = await ClientModel.create({
    organizationName: body.organizationName.trim(),
    category: body.category,
    primaryContact: body.primaryContact,
    assignedOpsLead: body.assignedOpsLead ?? '000000000000000000000001',
    healthScore: 70,
  });
  return c.json({ success: true, data: { id: String(client._id), healthScore: client.healthScore } }, 201);
});

// Demo mode: allow public access if no auth header, else enforce tenant
clientRoutes.use('*', async (c, next) => {
  const hasAuth = c.req.header('authorization') || c.req.header('cookie')?.includes('access_token');
  if (hasAuth) return authGuard(c, next);
  c.set('tenantFilter', {});
  c.set('user', { role: 'DEMO', clientId: null });
  await next();
});
clientRoutes.use('*', tenantIsolation);

clientRoutes.get('/', async (c) => {
  const filter = c.get('tenantFilter') as any;
  const clients = await ClientModel.find(filter.clientId ? { _id: filter.clientId } : {}).limit(50).lean();
  return c.json({ success: true, data: clients });
});

clientRoutes.get('/:id', async (c) => {
  const id = c.req.param('id');
  const client = await ClientModel.findById(id).lean();
  if (!client) return c.json({ success:false, error:{code:'NOT_FOUND'}},404);
  return c.json({ success:true, data: client });
});

clientRoutes.get('/:id/roadmap', async (c) => {
  const id = c.req.param('id');
  const filter = c.get('tenantFilter') as any;
  if (filter.clientId && String(filter.clientId) !== id) return c.json({ success:false, error:{code:'FORBIDDEN'}},403);
  const client = await ClientModel.findById(id).lean();
  if (!client) return c.json({ success:false, error:{code:'NOT_FOUND'}},404);
  const stations = [
    { id:'DIAGNOSIS', title:'التشخيص والتنظيف', status: client.operationalStage === 'DIAGNOSIS' ? 'IN_PROGRESS' : 'DONE', eta:'2 أيام' },
    { id:'RESTRUCTURING', title:'اعتماد الهيكل التنظيمي', status: client.operationalStage === 'RESTRUCTURING' ? 'IN_PROGRESS' : 'PENDING', eta:'3-5 أيام' },
    { id:'EXECUTION', title:'إطلاق حملة الرعاة', status:'PENDING', eta:'5-7 أيام' },
    { id:'COMPLETED', title:'المتابعة والتقييم', status:'PENDING', eta:'مستمر' },
  ];
  return c.json({ success:true, data:{ client, stations, health: HealthScore.create(client.healthScore) } });
});

clientRoutes.post('/:id/pulse', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const metrics = {
    hrStabilityScore: Math.round(60 + Math.random()*25),
    churnRiskRate: Math.round(18 + Math.random()*22),
    sponsorReadiness: Math.round(45 + Math.random()*30),
    executionSpeed: Math.round(60 + Math.random()*20),
  };
  const health = HealthScore.compute(metrics.hrStabilityScore, metrics.churnRiskRate, metrics.sponsorReadiness, metrics.executionSpeed);
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  if (!isDBReady()) {
    return c.json({ success:true, data:{ metrics, health, submissionId: 'mock-'+Date.now(), _mock:true } });
  }
  // لو id مش ObjectId (demo) — لا تحاول update
  const { Types } = await import('mongoose');
  if (!Types.ObjectId.isValid(String(id))) {
    return c.json({ success:true, data:{ metrics, health, submissionId: 'mock-'+Date.now(), _mock:true } });
  }
  await ClientModel.updateOne({ _id: id }, { $set: { healthScore: health.value } });
  const submission = await SubmissionModel.create({ clientId: id, targetScope: body.targetScope ?? 'FULL_OPS', rawAnswers: body.rawAnswers ?? {}, pulseMetrics: metrics, aiExecutiveBrief: `Pulse ${health.value} — ${health.label}`, isReviewedByOps: false });
  return c.json({ success:true, data:{ metrics, health, submissionId: String(submission._id) } });
});

clientRoutes.get('/:id/tickets', async (c) => {
  const id = c.req.param('id');
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  if (!isDBReady()) return c.json({ success:true, data: [], empty:true });
  const { Types } = await import('mongoose');
  if (!Types.ObjectId.isValid(String(id))) return c.json({ success:true, data: [], empty:true });
  const { TicketModel } = await import('../../infrastructure/database/schemas.js');
  const tickets = await TicketModel.find({ clientId: id }).sort({ createdAt: -1 }).limit(20).lean();
  return c.json({ success:true, data: tickets });
});
clientRoutes.post('/:id/tickets', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  if(!body.subject || body.subject.trim().length < 3) return c.json({ success:false, error:{code:'VALIDATION', message:'subject required'}},422);
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  if (!isDBReady()) {
    return c.json({ success:true, data: { id: 'mock-'+Date.now(), ticket:{ _id:'mock-'+Date.now(), subject: body.subject, urgency: body.urgency||'NORMAL', status:'OPEN' } }, _mock:true }, 201);
  }
  const { Types } = await import('mongoose');
  if (!Types.ObjectId.isValid(String(id))) {
    return c.json({ success:true, data: { id: 'mock-'+Date.now(), ticket:{ _id:'mock-'+Date.now(), subject: body.subject, urgency: body.urgency||'NORMAL', status:'OPEN' } }, _mock:true }, 201);
  }
  const { TicketModel } = await import('../../infrastructure/database/schemas.js');
  const ticket = await TicketModel.create({ clientId: id, source: body.source ?? 'WEB_DASHBOARD', subject: body.subject.trim(), description: (body.description ?? body.subject).trim(), urgency: body.urgency ?? 'NORMAL', status: 'OPEN', thread: [] });
  return c.json({ success:true, data: { id: String(ticket._id), ticket } }, 201);
});
