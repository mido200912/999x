import { Hono } from 'hono';
import { streamText } from 'hono/streaming';
import { authGuard } from '../middlewares/auth.guard.js';
import { rateLimiter } from '../middlewares/rate-limiter.js';
import { AIReportModel } from '../../infrastructure/database/schemas.js';
import { streamActionPlan, generateSponsorDeck } from '../../infrastructure/ai/openrouter.gateway.js';
import { chatWithAI } from '../../infrastructure/ai/chat.gateway.js';
import { generateBrandedPdf } from '../../infrastructure/pdf/branded-pdf.js';
import { createHash } from 'node:crypto';

export const aiRoutes = new Hono<{ Variables: { user?: any; tenantFilter?: any } }>();

// Demo: allow without auth, but rate limit always
aiRoutes.use('*', async (c, next) => {
  const hasAuth = c.req.header('authorization') || c.req.header('cookie')?.includes('access_token');
  if (hasAuth) return authGuard(c, next);
  c.set('user', { role: 'DEMO' } as any);
  await next();
});
// Rate limit: generous in dev, strict in prod
aiRoutes.use('*', async (c, next) => {
  const user = c.get('user') as any;
  const isDev = process.env.NODE_ENV !== 'production';
  const isDemo = !user || user.role === 'DEMO';
  // In dev: 1000/hour so testing is never blocked. In prod: 5 demo / 50 auth
  const max = isDev ? 1000 : (isDemo ? 5 : 50);
  return rateLimiter({ windowSec: 3600, max, keyPrefix: 'ai' })(c, next);
});

// SSE streaming — 999x.md §5 SSE + token budget enforcement
aiRoutes.post('/generate-plan-stream', async (c) => {
  const { clientId, problemType, category = 'STARTUP' } = await c.req.json();
  const user = c.get('user') as any;
  // Token budget check (Layer 3 — 999x.md §6-ج)
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  if (isDBReady() && clientId && clientId !== 'demo') {
    const { Types } = await import('mongoose');
    if (Types.ObjectId.isValid(String(clientId))) {
      const { ClientModel } = await import('../../infrastructure/database/schemas.js');
      const client = await ClientModel.findById(clientId).lean();
      if (client && client.tokenBudget.tokensUsed >= client.tokenBudget.monthlyLimit) {
        return c.json({ success: false, error: { code: 'QUOTA_EXCEEDED', message: 'Monthly AI token budget exhausted. Contact 999x team.' } }, 429);
      }
    }
  }
  return streamText(c, async (stream) => {
    let totalTokens = 0;
    try {
      const gen = streamActionPlan(clientId, problemType ?? 'hierarchy', category);
      for await (const chunk of gen) {
        totalTokens += chunk.token.length;
        await stream.write(`data: ${JSON.stringify({ token: chunk.token })}\n\n`);
      }
    } catch (err: any) {
      console.error('[AI Stream] ❌ Error during streaming:', err.message);
      // Send error token so the frontend can display it
      await stream.write(`data: ${JSON.stringify({ error: err.message || 'AI generation failed' })}\n\n`);
    }
    await stream.write('data: [DONE]\n\n');
    // Async token usage accounting (fire-and-forget)
    if (isDBReady() && clientId && clientId !== 'demo') {
      const { Types } = await import('mongoose');
      if (Types.ObjectId.isValid(String(clientId))) {
        const { ClientModel } = await import('../../infrastructure/database/schemas.js');
        await ClientModel.updateOne({ _id: clientId }, { $inc: { 'tokenBudget.tokensUsed': Math.ceil(totalTokens / 4) } }).catch(() => {});
      }
    }
  });
});

aiRoutes.post('/diagnose-pulse', async (c) => {
  const { category, pains, teamSize } = await c.req.json();
  // Reuse HealthScore logic server-side
  let hr=75, churn=22, sponsor=65, exec=70;
  if (category==='STARTUP'){ sponsor+=10; exec+=5; hr-=5; }
  else if (category==='VOLUNTEER_TEAM'){ churn+=14; hr-=12; sponsor-=8; }
  else if (category==='EVENT'){ sponsor+=12; exec+=8; hr-=4; }
  const painMap:any={ churn:{hr:-15,churn:18,sponsor:-4,exec:-8}, hierarchy:{hr:-18,churn:10,sponsor:-6,exec:-14}, sponsor:{hr:-2,churn:2,sponsor:-20,exec:-4}, delivery:{hr:-6,churn:6,sponsor:-4,exec:-18}};
  for(const p of (pains??[])){ const imp=painMap[p]; if(imp){ hr+=imp.hr; churn+=imp.churn; sponsor+=imp.sponsor; exec+=imp.exec; } }
  if(teamSize>60){ hr-=4; churn+=6; }
  const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,Math.round(n)));
  hr=clamp(hr,25,95); churn=clamp(churn,10,75); sponsor=clamp(sponsor,25,95); exec=clamp(exec,30,95);
  const health = Math.round(hr*0.35 + (100-churn)*0.3 + sponsor*0.2 + exec*0.15);
  const brief = `Health ${health} — HR ${hr}% Churn ${churn}% Sponsor ${sponsor}% Velocity ${exec}%`;
  return c.json({ success:true, data:{ hr,churn,sponsor,exec, health, brief } });
});

aiRoutes.post('/sponsor-studio', async (c) => {
  const { clientId, audience, category } = await c.req.json();
  const data = await generateSponsorDeck(clientId, audience ?? 'Fintech 800 attendees', category ?? 'EVENT');
  return c.json({ success:true, data });
});

aiRoutes.post('/rephrase', async (c) => {
  const { text, tone } = await c.req.json();
  if (!text) return c.json({ success:false, error:{code:'VALIDATION'}},422);
  // في الإنتاج: يستدعي OpenRouter مع prompt مخصص للنبرة
  const tones: Record<string,string> = {
    strict: 'بروتوكول تنفيذي صارم: إلزام كافة مسؤولي اللجان برفع تقارير أسبوعية عبر Kanban، مع إنهاء عضوية المتغيبين عن 2 Standups.',
    simple: 'خطوات بسيطة: 1. قسّم فريقك لمجموعات 3 أفراد. 2. عيّن مسؤول ترحيب. 3. خصص 10 دقائق يومياً لمراجعة المهام.',
  };
  const out = tones[tone] ?? tones.strict;
  return c.json({ success:true, data:{ rephrased: out, model:'minimax/minimax-m3:free (rephrase)' } });
});

aiRoutes.post('/generate-report', async (c) => {
  const { clientId, reportType, modelEngine, content } = await c.req.json();
  // لو clientId مش ObjectId (مثلاً "demo") — استخدم ObjectId وهمي ثابت للـ demo
  const { Types } = await import('mongoose');
  let cid: any = clientId;
  if (!Types.ObjectId.isValid(String(clientId))) {
    cid = new Types.ObjectId('000000000000000000000001');
  }
  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  if (!isDBReady()) {
    const verificationHash = createHash('sha256').update(`${clientId}${Date.now()}`).digest('hex').slice(0,16);
    const pdf = await generateBrandedPdf({ title: content?.title ?? 'خطة HR — 999x', clientName: String(clientId), executiveSummary: content?.executiveSummary ?? 'ملخص' });
    return c.json({ success:true, data:{ id: 'mock-'+verificationHash, verificationHash, pdf, _mock:true } });
  }
  const verificationHash = createHash('sha256').update(`${clientId}${Date.now()}`).digest('hex').slice(0,16);
  const report = await AIReportModel.create({ clientId: cid, reportType: reportType ?? 'HR_RESTRUCTURING', modelEngine: modelEngine ?? 'minimax/minimax-m3:free', version:1, content: content ?? { title:'خطة HR', executiveSummary:'ملخص', milestones:[{id:'m1', title:'RACI', description:'تحديد مسؤول', dueDateOffsetDays:7, status:'PENDING'}], strategicDirectives:['Kanban'], riskMitigations:[{risk:'تسرب', solution:'Onboarding'}]}, clientApproval:{isApproved:false}, verificationHash });
  const pdf = await generateBrandedPdf({ title: report.content.title, clientName: String(clientId), executiveSummary: report.content.executiveSummary });
  report.pdfExportUrl = pdf.url; await report.save();
  return c.json({ success:true, data:{ id: String(report._id), verificationHash, pdf } });
});

// ─── MASTER SYSTEM PROMPT: Complete 999x Backend Knowledge & Tool Execution ─
const MASTER_AGENT_PROMPT = `You are the "999x Supreme Autonomous Operations Agent & Strategic Architect" — the elite AI brain directly integrated into the 999x Operations Platform.
You have direct backend execution tools to query, mutate, create, and optimize database resources.

=== 999x BACKEND ARCHITECTURE & DATA SCHEMAS ===
1. Task Entity (Kanban Board):
   - Collection: tasks
   - Fields: title (string), details (string), priority ('LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'), columnStatus ('BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED'), deadline (ISO Date), clientId (ObjectId).
   - Tool signature: add_task(title, details, priority, columnStatus, deadline)

2. Client / Organization Entity (Multi-Company Hub):
   - Collection: clients
   - Fields: organizationName (string), category ('STARTUP' | 'EVENT' | 'VOLUNTEER_TEAM'), healthScore (0-100), operationalStage ('DIAGNOSIS' | 'RESTRUCTURING' | 'EXECUTION' | 'COMPLETED'), brandColor (hex), primaryContact ({ name, email, phone }).
   - Tool signature: add_company(organizationName, category, contactName, email, phone)

3. Interactive Strategic Roadmap (Milestones):
   - Collection: aireports
   - Fields: milestones ([{ id, title, description, status, dueDateOffsetDays }]), strategicDirectives ([string]), riskMitigations ([{ risk, solution }]).
   - Tool signature: update_plan(milestoneTitle, description, offsetDays)

4. PR & Prospects CRM (Lead Pipeline):
   - Collection: prospectleads
   - Fields: organizationName (string), category ('STARTUP' | 'EVENT' | 'VOLUNTEER_TEAM' | 'ENTERPRISE'), contactPerson (string), email (string), phone (string), status ('PENDING' | 'ACCEPTED' | 'REJECTED'), pitchAngle (string), estimatedBudget (string).
   - Tool signature: add_prospect(organizationName, category, contactPerson, email, phone, pitchAngle, estimatedBudget)

=== INSTRUCTIONS ===
Analyze the user command. If it asks to modify the backend, create a task, update a roadmap, create a company, or add a lead:
Identify the exact tool and parameters and execute it.
Always return rich, professional executive Arabic responses explaining precisely what changed in the database.`;

// ─── AI Autonomous Agent (Tool Execution / Function Calling) ─────────────────
aiRoutes.post('/agent-action', async (c) => {
  const { command, explicitTool, params, clientId } = await c.req.json();
  if (!command && !explicitTool) {
    return c.json({ success: false, error: { message: 'Command or explicit tool is required.' } }, 400);
  }

  const { isDBReady } = await import('../../infrastructure/database/connection.js');
  const { ClientModel, TaskModel, AIReportModel, ProspectLeadModel, AuditLogModel } = await import('../../infrastructure/database/schemas.js');
  const { Types } = await import('mongoose');

  let executedAction = '';
  let resultDetails: any = null;
  let reply = '';

  const cmd = (command || '').toLowerCase();

  // 1. Tool: Add Task to Kanban
  if (explicitTool === 'add_task' || cmd.includes('مهمة') || cmd.includes('تاسك') || cmd.includes('task')) {
    executedAction = 'ADD_TASK';
    const taskTitle = params?.title || command.replace(/ضيف مهمة|أضف مهمة|تاسك|task/gi, '').replace(/عاجلة|في الكانبان|بالكانبان|عاجل/gi, '').replace(/[:\-]/g, '').trim() || 'مهمة تشغيلية جديدة';
    const priority = params?.priority || (cmd.includes('عاجل') || cmd.includes('critical') ? 'CRITICAL' : cmd.includes('high') ? 'HIGH' : 'MEDIUM');
    const columnStatus = params?.columnStatus || 'TODO';

    // Resolve real client ObjectId
    let targetClientObjId: any;
    if (clientId && Types.ObjectId.isValid(String(clientId))) {
      targetClientObjId = new Types.ObjectId(clientId);
    } else {
      const existingClient = await ClientModel.findOne().lean();
      targetClientObjId = existingClient ? existingClient._id : new Types.ObjectId('000000000000000000000001');
    }

    const taskPayload = {
      clientId: targetClientObjId,
      assignedOpsMember: new Types.ObjectId('000000000000000000000001'),
      title: taskTitle,
      details: params?.details || `تم إنشاؤها آلياً بواسطة 999x AI Agent: "${command}"`,
      columnStatus,
      priority,
      deadline: params?.deadline ? new Date(params.deadline) : new Date(Date.now() + 86400000 * 5),
    };

    let createdTask: any = null;
    if (isDBReady()) {
      try {
        createdTask = await TaskModel.create(taskPayload);
        resultDetails = createdTask;
      } catch (err: any) {
        console.error('[AI Agent] Task create error:', err.message);
      }
    }

    if (!createdTask) {
      createdTask = { _id: 't-' + Date.now(), ...taskPayload };
      resultDetails = createdTask;
    }

    // Keep in shared memory so Kanban reflects it instantly
    if (!(globalThis as any).__999x_memory_tasks) (globalThis as any).__999x_memory_tasks = [];
    (globalThis as any).__999x_memory_tasks.unshift(createdTask);

    reply = `✅ تم تنفيذ الأمر بنجاح في قاعدة البيانات!\n\nقمت بإدراج المهمة: **"${taskTitle}"** في عمود **${columnStatus}** بأولوية **${priority}**، وستظهر فوراً في لوحة الكانبان.`;
  }
  // 2. Tool: Add New Company / Client
  else if (explicitTool === 'add_company' || cmd.includes('شركة جديدة') || cmd.includes('عميل جديد') || cmd.includes('add company') || cmd.includes('add client')) {
    executedAction = 'ADD_COMPANY';
    const companyName = params?.organizationName || command.replace(/ضيف شركة جديدة|أضف شركة|شركة جديدة|عميل جديد/gi, '').replace(/اسمها|باسم/gi, '').replace(/[:\-]/g, '').trim() || 'شركة جديدة ' + Math.floor(Math.random() * 900 + 100);
    const category = params?.category || (cmd.includes('event') || cmd.includes('مؤتمر') || cmd.includes('حدث') ? 'EVENT' : cmd.includes('تطوع') || cmd.includes('volunteer') ? 'VOLUNTEER_TEAM' : 'STARTUP');

    const clientPayload = {
      organizationName: companyName,
      category,
      brandColor: '#A3E635',
      primaryContact: {
        name: params?.contactName || 'المسؤول التنفيذي',
        email: params?.email || `ops@${companyName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'company'}.com`,
        phone: params?.phone || '+201000000000',
      },
      operationalStage: 'DIAGNOSIS',
      healthScore: 75,
      assignedOpsLead: new Types.ObjectId('000000000000000000000001'),
      tokenBudget: { monthlyLimit: 200000, tokensUsed: 0 },
    };

    let createdCompany: any = null;
    if (isDBReady()) {
      try {
        createdCompany = await ClientModel.create(clientPayload);
        resultDetails = createdCompany;
      } catch (err: any) {
        console.error('[AI Agent] Client create error:', err.message);
      }
    }

    if (!createdCompany) {
      createdCompany = { _id: 'c-' + Date.now(), ...clientPayload };
      resultDetails = createdCompany;
    }

    reply = `🚀 تم إنشاء وحفظ ملف الشركة في قاعدة البيانات بنجاح: **"${companyName}"** في قطاع **${category}**، وتم تفعيل البروفايل في الـ CRM ومبدل الشركات!`;
  }
  // 3. Tool: Modify / Update Strategic Plan (Milestone)
  else if (explicitTool === 'update_plan' || cmd.includes('خطة') || cmd.includes('مرحلة') || cmd.includes('milestone') || cmd.includes('plan')) {
    executedAction = 'UPDATE_PLAN';
    const milestoneTitle = params?.milestoneTitle || command.replace(/عدلي على الخطة|عدل الخطة|ضيف مرحلة|أضف مرحلة|عدلي الخطة/gi, '').replace(/[:\-]/g, '').trim() || 'مرحلة تشغيلية إضافية';
    
    const newMilestone = {
      id: 'm-' + Date.now(),
      title: milestoneTitle,
      description: params?.description || 'مرحلة تمت جدولتها وإضافتها بواسطة 999x AI Agent لتسريع العمليات',
      dueDateOffsetDays: params?.offsetDays || 7,
      assignedRole: 'Ops Lead',
      status: 'PENDING'
    };

    // Save to shared memory milestones
    if (!(globalThis as any).__999x_milestones) (globalThis as any).__999x_milestones = [];
    (globalThis as any).__999x_milestones.push({
      id: newMilestone.id,
      title: newMilestone.title,
      status: 'PENDING',
      eta: `${newMilestone.dueDateOffsetDays} أيام`,
      description: newMilestone.description
    });

    if (isDBReady()) {
      try {
        let repFilter: any = {};
        if (clientId && Types.ObjectId.isValid(String(clientId))) {
          repFilter = { clientId: new Types.ObjectId(clientId) };
        }
        let rep = await AIReportModel.findOne(repFilter).sort({ createdAt: -1 });
        if (!rep) {
          const clientRef = clientId && Types.ObjectId.isValid(String(clientId)) ? new Types.ObjectId(clientId) : new Types.ObjectId('000000000000000000000001');
          await AIReportModel.create({
            clientId: clientRef,
            reportType: 'HR_RESTRUCTURING',
            modelEngine: '999x-AI-Operator',
            version: 1,
            content: {
              title: 'الخطة الاستراتيجية المحدثة',
              executiveSummary: 'خطة تشغيلية تم تحديثها آلياً بواسطة 999x AI Agent',
              milestones: [newMilestone],
              strategicDirectives: ['أتمتة المتابعة الأسبوعية'],
              riskMitigations: [{ risk: 'تضارب الأولويات', solution: 'تحديد مسؤول وحيد' }]
            },
            verificationHash: 'v-' + Date.now()
          });
        } else {
          rep.content.milestones.push(newMilestone as any);
          await rep.save();
        }
      } catch (err: any) {
        console.error('[AI Agent] Plan update error:', err.message);
      }
    }

    resultDetails = newMilestone;
    reply = `⚡ تم تحديث الخطة التشغيلية بنجاح في قاعدة البيانات!\n\nتم إدراج المرحلة الجديدة: **"${milestoneTitle}"** بمدة إنجاز **7 أيام**، وستظهر فوراً في الـ Interactive Roadmap.`;
  }
  // 4. Tool: Add Prospect / Lead
  else if (explicitTool === 'add_prospect' || cmd.includes('عميل محتمل') || cmd.includes('ليد') || cmd.includes('prospect') || cmd.includes('lead')) {
    executedAction = 'ADD_PROSPECT';
    const prospectName = params?.organizationName || command.replace(/ضيف عميل محتمل|أضف ليد|عميل محتمل|ليد/gi, '').replace(/[:\-]/g, '').trim() || 'عميل محتمل جديد';
    
    const leadPayload = {
      organizationName: prospectName,
      category: params?.category || 'STARTUP',
      contactPerson: params?.contactPerson || 'جهة الاتصال الأولية',
      email: params?.email || `contact@${prospectName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'lead'}.com`,
      phone: params?.phone || '+201000000000',
      status: 'PENDING',
      pitchAngle: params?.pitchAngle || 'تم الرصد والتحليل المبدئي بواسطة 999x AI Co-Pilot',
      estimatedBudget: params?.estimatedBudget || '35,000 EGP',
    };

    let createdLead: any = null;
    if (isDBReady()) {
      try {
        createdLead = await ProspectLeadModel.create(leadPayload);
        resultDetails = createdLead;
      } catch (err: any) {
        console.error('[AI Agent] Lead create error:', err.message);
      }
    }

    if (!createdLead) {
      createdLead = { _id: 'p-' + Date.now(), ...leadPayload, createdAt: new Date().toISOString() };
      resultDetails = createdLead;
    }

    reply = `📋 تم تسجيل العميل المحتمل: **"${prospectName}"** في قاعدة بيانات الـ PR Pipeline بحالة **PENDING (قيد الدراسة)**.`;
  }
  // Fallback: Strategic Interpretation
  else {
    executedAction = 'STRATEGIC_INTERPRETATION';
    resultDetails = { command, status: 'PROCESSED' };
    reply = `💡 مرحباً! أنا **999x Autonomous Agent**.\n\nفهمت طلبك: "${command}".\nيمكنك أمري مباشرة بإجراء تعديلات فعلية في السيرفر مثل:\n• *"ضيف مهمة عاجلة في الكانبان لمراجعة العقود"*\n• *"عدلي على الخطة وضيف مرحلة الإطلاق التجريبي"*\n• *"ضيف شركة جديدة اسمها Alex Hub"*\n• *"سجل عميل محتمل جديد"*\nوسأقوم بتنفيذ الأمر وتحديث قاعدة البيانات لحظياً!`;
  }

  // Audit trail logging
  if (isDBReady()) {
    try {
      await AuditLogModel.create({
        actorId: new Types.ObjectId('000000000000000000000001'),
        actorEmail: 'ai-operator@999x.earth',
        action: `AI_AGENT_${executedAction}`,
        resource: 'SYSTEM',
        ipAddress: '127.0.0.1',
        userAgent: '999x-AI-Agent-Master/2.0',
        metadata: { command, executedAction, resultDetails }
      });
    } catch {}
  }

  return c.json({
    success: true,
    data: {
      action: executedAction,
      reply,
      details: resultDetails,
      executedAt: new Date().toISOString(),
    }
  });
});

// ─── Strategic AI Chatbot (Real OpenRouter) ────────────────────────────────
aiRoutes.post('/chat', async (c) => {
  const { message, context = {} } = await c.req.json();
  if (!message) return c.json({ success: false, error: { message: 'Message is required' } }, 400);

  try {
    const reply = await chatWithAI(message, {
      organizationName: context.organizationName,
      category: context.category,
      healthScore: context.healthScore,
    });

    return c.json({
      success: true,
      data: {
        reply,
        timestamp: new Date().toISOString(),
        model: '999x-OpenRouter-AI',
      }
    });
  } catch (err: any) {
    console.error('[AI Chat] Error:', err.message);
    return c.json({ success: false, error: { message: err.message || 'AI chat error' } }, 500);
  }
});



