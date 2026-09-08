import { Hono } from 'hono';
import { streamText } from 'hono/streaming';
import { authGuard } from '../middlewares/auth.guard.js';
import { rateLimiter } from '../middlewares/rate-limiter.js';
import { AIReportModel } from '../../infrastructure/database/schemas.js';
import { streamActionPlan, generateSponsorDeck } from '../../infrastructure/ai/openrouter.gateway.js';
import { generateBrandedPdf } from '../../infrastructure/pdf/branded-pdf.js';
import { createHash } from 'node:crypto';

export const aiRoutes = new Hono();

// Demo: allow without auth, but rate limit always
aiRoutes.use('*', async (c, next) => {
  const hasAuth = c.req.header('authorization') || c.req.header('cookie')?.includes('access_token');
  if (hasAuth) return authGuard(c, next);
  c.set('user', { role: 'DEMO' } as any);
  await next();
});
aiRoutes.use('*', rateLimiter({ windowSec: 60, max: 30, keyPrefix: 'ai' }));

// SSE streaming — 999x.md:5 SSE
aiRoutes.post('/generate-plan-stream', async (c) => {
  const { clientId, problemType, category = 'STARTUP' } = await c.req.json();
  return streamText(c, async (stream) => {
    const gen = streamActionPlan(clientId, problemType ?? 'hierarchy', category);
    for await (const chunk of gen) {
      await stream.write(`data: ${JSON.stringify({ token: chunk.token })}\n\n`);
    }
    await stream.write('data: [DONE]\n\n');
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
