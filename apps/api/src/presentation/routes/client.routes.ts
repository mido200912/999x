import { Hono } from 'hono';
import { ClientModel, SubmissionModel, AIReportModel } from '../../infrastructure/database/schemas.js';
import { authGuard, roleGuard } from '../middlewares/auth.guard.js';
import { tenantIsolation } from '../middlewares/tenant-isolation.js';
import { HealthScore } from '../../core/value-objects/health-score.vo.js';

export const clientRoutes = new Hono<{ Variables: { user?: any; tenantFilter?: any } }>();

// Public: register client (no auth) — used by onboarding wizard
clientRoutes.post('/register', async (c) => {
  const body = await c.req.json();
  if(!body.organizationName || !body.subtitle || !body.primaryContact?.phone){
    return c.json({ success:false, error:{ code:'VALIDATION', message:'organizationName, subtitle, primaryContact.phone required' } }, 422);
  }
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  if (!isDBReady()) {
    const mockId = 'CLI-' + Date.now().toString(36).toUpperCase();
    return c.json({ success: true, data: { id: mockId, healthScore: 70, _mock:true, demo:true } }, 201);
  }
  const { Types } = await import('mongoose');
  try {
    const client = await ClientModel.create({
      organizationName: body.organizationName.trim(),
      subtitle: body.subtitle.trim(),
      description: body.description?.trim(),
      companyType: body.companyType,
      companyTypeCustom: body.companyTypeCustom,
      eventDetails: body.eventDetails,
      customDetails: body.customDetails,
      brandColor: body.brandColor,
      logoUrl: body.logoUrl,
      primaryContact: body.primaryContact,
      // Use provided opsLead or generate a placeholder ObjectId
      assignedOpsLead: body.assignedOpsLead
        ? new Types.ObjectId(body.assignedOpsLead)
        : new Types.ObjectId(),
      healthScore: 70,
      registrationStatus: 'PENDING'
    });
    return c.json({ success: true, data: { id: String(client._id), healthScore: client.healthScore } }, 201);
  } catch (err: any) {
    // Validation error
    if (err.name === 'ValidationError') {
      return c.json({ success: false, error: { code: 'VALIDATION', message: err.message } }, 422);
    }
    throw err;
  }
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
  const { Types } = await import('mongoose');
  if (!Types.ObjectId.isValid(String(id))) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Invalid client ID format' } }, 404);
  }
  const client = await ClientModel.findById(id).lean();
  if (!client) return c.json({ success:false, error:{code:'NOT_FOUND'}},404);
  return c.json({ success:true, data: client });
});

clientRoutes.get('/:id/roadmap', async (c) => {
  const id = c.req.param('id');
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  const { Types } = await import('mongoose');

  let client: any = null;
  let customMilestones: any[] = [];

  if (isDBReady() && Types.ObjectId.isValid(String(id))) {
    client = await ClientModel.findById(id).lean();
    const reports = await AIReportModel.find({ clientId: new Types.ObjectId(id) }).sort({ createdAt: -1 }).lean();
    for (const rep of reports) {
      if (rep.content?.milestones && Array.isArray(rep.content.milestones)) {
        for (const m of rep.content.milestones) {
          customMilestones.push({
            id: m.id || String((m as any)._id) || 'm-' + Math.random(),
            title: m.title,
            status: m.status || 'PENDING',
            eta: `${m.dueDateOffsetDays || 5} أيام`,
            description: m.description || 'مرحلة تنفيذية استراتيجية مضافة بواسطة 999x AI Engine',
          });
        }
      }
    }
  }

  // Also check memory milestones if any were added
  const memMilestones = (globalThis as any).__999x_milestones || [];
  customMilestones = [...customMilestones, ...memMilestones];

  const stage = client?.operationalStage || 'DIAGNOSIS';
  const defaultStations = [
    { id:'DIAGNOSIS', title:'التشخيص والتنظيف الأولي', status: stage === 'DIAGNOSIS' ? 'IN_PROGRESS' : 'DONE', eta:'2 أيام', description:'تشخيص الاحتكاك التشغيلي ومؤشرات الـ Pulse' },
    { id:'RESTRUCTURING', title:'اعتماد الهيكل ومصفوفة RACI', status: stage === 'RESTRUCTURING' ? 'IN_PROGRESS' : (stage === 'DIAGNOSIS' ? 'PENDING' : 'DONE'), eta:'3-5 أيام', description:'تحديد مسؤول وحيد لكل لجنة ومهمة حرجة' },
    { id:'EXECUTION', title:'إطلاق حملة الرعاة والتسويق', status: stage === 'EXECUTION' ? 'IN_PROGRESS' : (stage === 'COMPLETED' ? 'DONE' : 'PENDING'), eta:'5-7 أيام', description:'إرسال باقات الرعاية وتنسيق اجتماعات الشركاء' },
    { id:'COMPLETED', title:'المتابعة والتقييم الدوري', status: stage === 'COMPLETED' ? 'DONE' : 'PENDING', eta:'مستمر', description:'لوحات المتابعة الأسبوعية ومراجعة الأداء' },
  ];

  const stations = [...defaultStations, ...customMilestones];

  return c.json({
    success: true,
    data: {
      client: client || { organizationName: 'المؤسسة النشطة', category: 'STARTUP', healthScore: 78, operationalStage: stage },
      stations,
      health: HealthScore.create(client?.healthScore || 78),
    }
  });
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
  const filter = c.get('tenantFilter') as any;
  if (filter.clientId && String(filter.clientId) !== id) return c.json({ success: false, error: { code: 'FORBIDDEN' } }, 403);
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  if (!isDBReady()) return c.json({ success: true, data: [], empty: true });
  const { Types } = await import('mongoose');
  if (!Types.ObjectId.isValid(String(id))) return c.json({ success: true, data: [], empty: true });
  const { TicketModel } = await import('../../infrastructure/database/schemas.js');
  const tickets = await TicketModel.find({ clientId: id }).sort({ createdAt: -1 }).limit(20).lean();
  return c.json({ success: true, data: tickets });
});

clientRoutes.post('/:id/tickets', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  if (!body.subject || body.subject.trim().length < 3) return c.json({ success: false, error: { code: 'VALIDATION', message: 'subject required' } }, 422);
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  if (!isDBReady()) {
    return c.json({ success: true, data: { id: 'mock-' + Date.now(), ticket: { _id: 'mock-' + Date.now(), subject: body.subject, urgency: body.urgency || 'NORMAL', status: 'OPEN' } }, _mock: true }, 201);
  }
  const { Types } = await import('mongoose');
  if (!Types.ObjectId.isValid(String(id))) {
    return c.json({ success: true, data: { id: 'mock-' + Date.now(), ticket: { _id: 'mock-' + Date.now(), subject: body.subject, urgency: body.urgency || 'NORMAL', status: 'OPEN' } }, _mock: true }, 201);
  }
  const { TicketModel } = await import('../../infrastructure/database/schemas.js');
  const ticket = await TicketModel.create({ clientId: id, source: body.source ?? 'WEB_DASHBOARD', subject: body.subject.trim(), description: (body.description ?? body.subject).trim(), urgency: body.urgency ?? 'NORMAL', status: 'OPEN', thread: [] });
  return c.json({ success: true, data: { id: String(ticket._id), ticket } }, 201);
});

// GET reports for a client
clientRoutes.get('/:id/reports', async (c) => {
  const id = c.req.param('id');
  const filter = c.get('tenantFilter') as any;
  if (filter.clientId && String(filter.clientId) !== id) return c.json({ success: false, error: { code: 'FORBIDDEN' } }, 403);
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  if (!isDBReady()) return c.json({ success: true, data: [], empty: true });
  const { Types } = await import('mongoose');
  if (!Types.ObjectId.isValid(String(id))) return c.json({ success: true, data: [] });
  const { AIReportModel } = await import('../../infrastructure/database/schemas.js');
  const reports = await AIReportModel.find({ clientId: id }).sort({ createdAt: -1 }).limit(10).lean();
  return c.json({ success: true, data: reports });
});

// POST approve a report — client approves AI-generated plan
clientRoutes.post('/:id/approve-report', async (c) => {
  const id = c.req.param('id');
  const filter = c.get('tenantFilter') as any;
  if (filter.clientId && String(filter.clientId) !== id) return c.json({ success: false, error: { code: 'FORBIDDEN' } }, 403);
  const body = await c.req.json();
  if (!body.reportId) return c.json({ success: false, error: { code: 'VALIDATION', message: 'reportId required' } }, 422);
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  if (!isDBReady()) return c.json({ success: true, data: { approved: true, _mock: true } });
  const { AIReportModel } = await import('../../infrastructure/database/schemas.js');
  // IDOR guard: must match clientId
  const report = await AIReportModel.findOneAndUpdate(
    { _id: body.reportId, clientId: id },
    { $set: { 'clientApproval.isApproved': true, 'clientApproval.approvedAt': new Date(), 'clientApproval.clientFeedback': body.feedback ?? '' } },
    { new: true }
  ).lean();
  if (!report) return c.json({ success: false, error: { code: 'NOT_FOUND' } }, 404);
  return c.json({ success: true, data: { approved: true, report } });
});

