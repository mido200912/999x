import { Hono } from 'hono';
import { authGuard, roleGuard } from '../middlewares/auth.guard.js';
import { ClientModel, TaskModel, AIReportModel } from '../../infrastructure/database/schemas.js';

export const adminRoutes = new Hono();
// Demo: allow without auth, else enforce
adminRoutes.use('*', async (c, next) => {
  const hasAuth = c.req.header('authorization') || c.req.header('cookie')?.includes('access_token');
  if (hasAuth) return authGuard(c, next);
  c.set('user', { role: 'DEMO', email: 'demo@999x.earth' } as any);
  await next();
});

adminRoutes.get('/cockpit', async (c) => {
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  if (!isDBReady()) {
    return c.json({ success:true, data:{ clients: [], kanban: { BACKLOG:[], TODO:[], IN_PROGRESS:[], IN_REVIEW:[], COMPLETED:[] }, _mock:false, empty:true } });
  }
  const clients = await ClientModel.find().lean();
  const tasks = await TaskModel.find().sort({ deadline: 1 }).lean();
  const grouped = {
    BACKLOG: tasks.filter(t=>t.columnStatus==='BACKLOG'),
    TODO: tasks.filter(t=>t.columnStatus==='TODO'),
    IN_PROGRESS: tasks.filter(t=>t.columnStatus==='IN_PROGRESS'),
    IN_REVIEW: tasks.filter(t=>t.columnStatus==='IN_REVIEW'),
    COMPLETED: tasks.filter(t=>t.columnStatus==='COMPLETED'),
  };
  return c.json({ success:true, data:{ clients, kanban: grouped } });
});

adminRoutes.get('/ai-studio', async (c) => {
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  const models = [
    { id:'minimax/minimax-m3:free', use:'تقارير وخطط HR', cost:'$0/MTok (FREE)', latency:'1.8s' },
    { id:'minimax/minimax-m3:free', use:'تلخيص سريع + PR', cost:'$0/MTok (FREE)', latency:'1.2s' },
    { id:'minimax/minimax-m3:free', use:'تفكير منطقي + رعاة', cost:'$0/MTok (FREE)', latency:'1.8s' },
  ];
  if (!isDBReady()) return c.json({ success:true, data:{ models, recent: [] } });
  const reports = await AIReportModel.find().sort({ createdAt: -1 }).limit(20).lean();
  return c.json({ success:true, data:{ models, recent: reports } });
});

adminRoutes.get('/crm', async (c) => {
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  if (!isDBReady()) return c.json({ success:true, data: [], empty:true });
  const ledger = await ClientModel.find().select('organizationName category operationalStage healthScore tokenBudget primaryContact assignedOpsLead').lean();
  return c.json({ success:true, data: ledger });
});

adminRoutes.post('/tasks', async (c) => {
  const body = await c.req.json();
  if(!body.title || body.title.trim().length < 2) return c.json({ success:false, error:{code:'VALIDATION', message:'title required'}},422);
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  if (!isDBReady()) {
    // demo without DB — رجع mock id وسيُحفظ في localStorage فقط
    return c.json({ success:true, data:{ _id: 'mock-'+Date.now(), clientId: body.clientId||'demo', title: body.title, priority: body.priority||'MEDIUM', columnStatus: body.columnStatus||'BACKLOG', deadline: new Date().toISOString(), _mock:true } }, 201);
  }
  const task = await TaskModel.create({
    clientId: body.clientId || '000000000000000000000001',
    assignedOpsMember: body.assignedOpsMember || '000000000000000000000001',
    title: body.title,
    details: body.details || body.title,
    columnStatus: body.columnStatus || 'BACKLOG',
    priority: body.priority || 'MEDIUM',
    deadline: body.deadline ? new Date(body.deadline) : new Date(Date.now()+ 2*24*3600*1000),
  });
  return c.json({ success:true, data: task }, 201);
});

adminRoutes.patch('/tasks/:id/move', async (c) => {
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  if (!isDBReady()) return c.json({ success:true, data:{ _id: c.req.param('id'), columnStatus: (await c.req.json()).columnStatus, _mock:true } });
  const id = c.req.param('id');
  const { columnStatus } = await c.req.json();
  const task = await TaskModel.findByIdAndUpdate(id, { columnStatus }, { new: true }).lean();
  return c.json({ success:true, data: task });
});
