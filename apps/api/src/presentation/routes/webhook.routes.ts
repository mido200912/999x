import { Hono } from 'hono';
import { TicketModel } from '../../infrastructure/database/schemas.js';
import { AppError } from '../../core/contracts/index.js';

export const webhookRoutes = new Hono();

// WhatsApp Business API webhook — 999x.md:5 webhook
webhookRoutes.post('/whatsapp', async (c) => {
  const body = await c.req.json().catch(()=> ({}));
  const text: string = body.text ?? body.message ?? body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body ?? '';
  const from: string = body.from ?? body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from ?? 'unknown';
  if (!text) return c.json({ success:false, error:{ code:'BAD_REQUEST'}},400);

  // naive urgency classifier (in prod: Minimax M3)
  const lower = text.toLowerCase();
  const urgency = lower.includes('اعتذر') || lower.includes('cancel') || lower.includes('critical') ? 'CRITICAL_BLOCKER' : lower.includes('تأخر') ? 'URGENT' : 'NORMAL';
  const aiSuggestedSolution = urgency === 'CRITICAL_BLOCKER'
    ? 'تفعيل شبكة بدلاء 999x: 3 متحدثين بدلاء تم اقتراحهم، وتعديل جدول الجلسات فوراً.'
    : 'اقتراح: إعادة توزيع المهام عبر Kanban وتثبيت مسؤول متابعة.';

  // need clientId — resolve via from phone -> client (mock)
  const clientId = body.clientId ?? '000000000000000000000001';
  const ticket = await TicketModel.create({
    clientId, source:'WHATSAPP_BOT', subject: text.slice(0,60), description: text,
    urgency, status:'OPEN', aiSuggestedSolution,
    thread:[{ senderName: from, message: text, timestamp: new Date() }],
  });

  // In prod: notify Ops War Room via SSE + Slack
  console.log(`[999x] WhatsApp ticket ${String(ticket._id)} urgency=${urgency}`);

  return c.json({ success:true, data:{ ticketId: String(ticket._id), urgency, aiSuggestedSolution } });
});

webhookRoutes.get('/whatsapp/verify', (c) => {
  const mode = c.req.query('hub.mode');
  const token = c.req.query('hub.verify_token');
  const challenge = c.req.query('hub.challenge');
  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) return c.text(challenge ?? '');
  throw new AppError('FORBIDDEN','Verify failed',403);
});

