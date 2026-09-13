/**
 * chat.gateway.ts — Real AI chat via OpenRouter
 * Called from /api/ai/chat route
 */

const CHAT_SYSTEM_PROMPT = `You are the "999x Supreme Strategic Co-Pilot" — an elite operational consultant for startups, events and volunteer teams.
You work inside the 999x Operations Hub platform.
ALWAYS respond in Arabic, professionally and with immediately actionable advice.
When the user asks to execute something (add task, company, prospect) — mention they can switch to Operator Mode in the same interface.
Be concise and smart. Use Markdown formatting.`;

export async function chatWithAI(
  message: string,
  context: { organizationName?: string; category?: string; healthScore?: number }
): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  const org = context.organizationName || 'المؤسسة';
  const health = context.healthScore || 75;
  const userContent = `المؤسسة: ${org} | القطاع: ${context.category || 'STARTUP'} | مؤشر الصحة: ${health}%\n\nالسؤال: ${message}`;

  if (!key || key.includes('xxx')) {
    console.warn('[999x Chat] No valid OPENROUTER_API_KEY — using local fallback.');
    return localFallback(message, org, health);
  }

  try {
    console.log('[999x Chat] Calling OpenRouter...');
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://999x.earth',
        'X-Title': '999x Co-Pilot Chat',
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
        stream: false,
        messages: [
          { role: 'system', content: CHAT_SYSTEM_PROMPT },
          { role: 'user', content: userContent },
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error(`[999x Chat] OpenRouter ${res.status}:`, errText.slice(0, 300));
      return localFallback(message, org, health);
    }

    const json = await res.json() as any;
    const reply = (json.choices?.[0]?.message?.content ?? '').trim();
    if (!reply) {
      console.warn('[999x Chat] Empty reply — local fallback.');
      return localFallback(message, org, health);
    }
    console.log('[999x Chat] Real AI reply | model:', json.model, '| tokens:', json.usage?.total_tokens);
    return reply;
  } catch (err: any) {
    console.error('[999x Chat] Connection error:', err.message);
    return localFallback(message, org, health);
  }
}

function localFallback(message: string, org: string, health: number): string {
  const msg = message.toLowerCase();
  if (msg.includes('رعاية') || msg.includes('sponsor') || msg.includes('باقات') || msg.includes('تسعير')) {
    return `**استراتيجية باقات الرعاية لـ ${org}:**\n\n**Gold 55,000 EGP** — كلمة افتتاحية + جناح رئيسي + بيانات المشاركين\n**Silver 30,000 EGP** — رعاية ورشة + حملة سوشيال 5 بوستات\n**Bronze 12,000 EGP** — تواجد رقمي + شهادة رسمية\n\n> بدّل لوضع المنفذ الآلي لتسجيل راعٍ فوراً!`;
  }
  if (msg.includes('تسرب') || msg.includes('فريق') || msg.includes('hr')) {
    return `**تحليل الفريق — ${org} (${health}%):**\n\n🤖 **AI:** Predictive Churn Radar + أتمتة Kanban\n🛠️ **تشغيلي:** Daily Standup 15 دقيقة + RACI Matrix + Freeze Period 72 ساعة\n\n> قل لي مهمة وأضيفها في الكانبان فوراً!`;
  }
  return `**999x Co-Pilot | ${org}** (صحة: ${health}%)\n\n"${message}"\n\nيمكنني مساعدتك في الاستراتيجية، الرعاية، إدارة الفريق، أو التنفيذ المباشر.\nما الذي تحتاجه تحديداً؟`;
}
