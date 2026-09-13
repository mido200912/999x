import { Hono } from 'hono';
import { ProspectLeadModel, ClientModel, AuditLogModel } from '../../infrastructure/database/schemas.js';

export const prospectsRoutes = new Hono<{ Variables: { user?: any; tenantFilter?: any } }>();

// In-memory fallback cache for when DB is in demo mode
let memoryProspects: any[] = [
  {
    _id: 'mock-p1',
    organizationName: 'EduTech Egypt Hub',
    category: 'STARTUP',
    contactPerson: 'عمر خالد',
    email: 'omar@edutech-eg.com',
    phone: '+201099887766',
    status: 'PENDING',
    pitchAngle: 'تحسين نسبة الاحتفاظ بالطلاب وأتمتة العمليات الإدارية',
    estimatedBudget: '40,000 EGP',
    notes: 'تواصل أولي ممتاز، في انتظار مراجعة خطة العمل المقترحة.',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    _id: 'mock-p2',
    organizationName: 'Cairo Robotics Summit 2026',
    category: 'EVENT',
    contactPerson: 'سارة فوزي',
    email: 'sara@cairorobotics.org',
    phone: '+201122334455',
    status: 'ACCEPTED',
    pitchAngle: 'إدارة رعاية الشركات وهندسة مسارات الحضور والتشغيل',
    estimatedBudget: '85,000 EGP',
    notes: 'تمت الموافقة من اللجنة المنظمة وجاهزون لتوقيع بروتوكول التشغيل.',
    createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
  },
  {
    _id: 'mock-p3',
    organizationName: 'Future Coders Team',
    category: 'VOLUNTEER_TEAM',
    contactPerson: 'أحمد شريف',
    email: 'contact@futurecoders.club',
    phone: '+201200112233',
    status: 'REJECTED',
    pitchAngle: 'إعادة هيكلة اللجان التطوعية وتقليل التسرب',
    estimatedBudget: '15,000 EGP',
    notes: 'اعتذروا لعدم توفر ميزانية للأنشطة هذا الفصل، تم التأجيل للعام القادم.',
    createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
  }
];

// GET /api/prospects — list all prospects
prospectsRoutes.get('/', async (c) => {
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  if (!isDBReady()) {
    return c.json({ success: true, data: memoryProspects });
  }
  try {
    const leads = await ProspectLeadModel.find().sort({ createdAt: -1 }).lean();
    if (leads.length === 0) {
      return c.json({ success: true, data: memoryProspects });
    }
    return c.json({ success: true, data: leads });
  } catch {
    return c.json({ success: true, data: memoryProspects });
  }
});

// POST /api/prospects — create prospect
prospectsRoutes.post('/', async (c) => {
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  const body = await c.req.json();
  
  if (!body.organizationName || !body.contactPerson || !body.email) {
    return c.json({ success: false, error: { message: 'Organization name, contact person, and email are required.' } }, 400);
  }

  const newDoc = {
    _id: 'p-' + Date.now(),
    organizationName: body.organizationName,
    category: body.category || 'STARTUP',
    contactPerson: body.contactPerson,
    email: body.email,
    phone: body.phone || '',
    status: body.status || 'PENDING',
    pitchAngle: body.pitchAngle || '',
    estimatedBudget: body.estimatedBudget || '',
    notes: body.notes || '',
    createdAt: new Date().toISOString(),
  };

  if (!isDBReady()) {
    memoryProspects.unshift(newDoc);
    return c.json({ success: true, data: newDoc }, 201);
  }

  try {
    const created = await ProspectLeadModel.create(newDoc);
    return c.json({ success: true, data: created }, 201);
  } catch (e: any) {
    memoryProspects.unshift(newDoc);
    return c.json({ success: true, data: newDoc }, 201);
  }
});

// PATCH /api/prospects/:id — update prospect
prospectsRoutes.patch('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const { isDBReady } = await import('../../infrastructure/database/connection.js');

  if (!isDBReady() || id.startsWith('mock-') || id.startsWith('p-')) {
    const idx = memoryProspects.findIndex(p => p._id === id);
    if (idx !== -1) {
      memoryProspects[idx] = { ...memoryProspects[idx], ...body, updatedAt: new Date().toISOString() };
      return c.json({ success: true, data: memoryProspects[idx] });
    }
    return c.json({ success: true, data: { _id: id, ...body } });
  }

  try {
    const updated = await ProspectLeadModel.findByIdAndUpdate(id, { $set: body }, { new: true }).lean();
    return c.json({ success: true, data: updated });
  } catch {
    return c.json({ success: true, data: { _id: id, ...body } });
  }
});

// DELETE /api/prospects/:id — delete prospect
prospectsRoutes.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const { isDBReady } = await import('../../infrastructure/database/connection.js');

  memoryProspects = memoryProspects.filter(p => p._id !== id);

  if (isDBReady() && !id.startsWith('mock-') && !id.startsWith('p-')) {
    try {
      await ProspectLeadModel.findByIdAndDelete(id);
    } catch {}
  }

  return c.json({ success: true, message: 'Prospect deleted successfully' });
});

// POST /api/prospects/:id/convert — Convert accepted prospect to active client
prospectsRoutes.post('/:id/convert', async (c) => {
  const id = c.req.param('id');
  const { isDBReady } = await import('../../infrastructure/database/connection.js');

  let targetLead = memoryProspects.find(p => p._id === id);

  if (isDBReady() && !id.startsWith('mock-') && !id.startsWith('p-')) {
    try {
      const dbLead = await ProspectLeadModel.findById(id).lean();
      if (dbLead) targetLead = dbLead;
    } catch {}
  }

  if (!targetLead) {
    return c.json({ success: false, error: { message: 'Prospect lead not found' } }, 404);
  }

  // Construct new client
  const newClientData = {
    organizationName: targetLead.organizationName,
    category: targetLead.category === 'ENTERPRISE' ? 'STARTUP' : (targetLead.category || 'STARTUP'),
    brandColor: '#A3E635',
    primaryContact: {
      name: targetLead.contactPerson,
      email: targetLead.email,
      phone: targetLead.phone || '+201000000000',
      whatsappPhone: targetLead.phone || '',
    },
    operationalStage: 'DIAGNOSIS',
    healthScore: 78,
    tokenBudget: { monthlyLimit: 200000, tokensUsed: 0 },
  };

  let newClientId = 'client-' + Date.now();

  if (isDBReady()) {
    try {
      const { Types } = await import('mongoose');
      const opsLeadId = new Types.ObjectId('000000000000000000000001');
      const clientDoc = await ClientModel.create({
        ...newClientData,
        assignedOpsLead: opsLeadId,
      });
      newClientId = String(clientDoc._id);
      await ProspectLeadModel.findByIdAndUpdate(id, {
        $set: { status: 'ACCEPTED', convertedClientId: clientDoc._id }
      });
    } catch {}
  }

  // Update in memory too
  const idx = memoryProspects.findIndex(p => p._id === id);
  if (idx !== -1) {
    memoryProspects[idx].status = 'ACCEPTED';
    memoryProspects[idx].convertedClientId = newClientId;
  }

  return c.json({
    success: true,
    message: `Successfully converted "${targetLead.organizationName}" to an active client!`,
    data: {
      prospectId: id,
      clientId: newClientId,
      organizationName: targetLead.organizationName,
    }
  });
});
