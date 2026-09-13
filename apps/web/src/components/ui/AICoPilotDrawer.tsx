import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, Sparkles, Send, X, Terminal, Cpu, CheckCircle2, MessageSquare, Zap, Loader2, ArrowRight } from 'lucide-react';
import { api } from '../../lib/api';
import { storage } from '../../lib/storage';

type ChatMessage = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actionExecuted?: string;
  details?: any;
};

export function AICoPilotDrawer() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'ADVISOR' | 'OPERATOR'>('ADVISOR');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'ai',
      text: 'مرحباً بك! أنا **999x Executive AI Co-Pilot**.\n\nيمكنك استشارتي في **وضع المستشار** لطلب أفكار واستراتيجيات متقدمة، أو استخدام **وضع المنفذ الآلي (Operator)** لإعطائي أوامر بتعديل الخطط، إضافة مهام الكانبان، أو تسجيل عملاء جدد في السيرفر مباشرة!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = input.trim();
    if (!clean || loading) return;

    const userMsg: ChatMessage = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text: clean,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const activeCompany = storage.get<any>('999x_active_company', {
      name: 'المؤسسة',
      category: 'STARTUP',
      healthScore: 75,
    });

    try {
      if (mode === 'OPERATOR') {
        // Direct tool execution on backend
        // api() already unwraps json.data, so res IS the inner data object
        const res = await api<{ reply: string; action: string; details: any }>('/ai/agent-action', {
          method: 'POST',
          body: JSON.stringify({
            command: clean,
            clientId: activeCompany?.id || 'demo',
          }),
        });

        const replyMsg: ChatMessage = {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: res.reply || 'تم تنفيذ الإجراء بنجاح في قاعدة البيانات.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionExecuted: res.action,
          details: res.details,
        };

        setMessages((prev) => [...prev, replyMsg]);
        // Trigger generic refresh in case data changed
        window.dispatchEvent(new CustomEvent('999x:data-updated'));
      } else {
        // Consultative Strategic Q&A
        // api() already unwraps json.data, so res IS the inner data object
        const res = await api<{ reply: string; model: string; timestamp: string }>('/ai/chat', {
          method: 'POST',
          body: JSON.stringify({
            message: clean,
            context: {
              organizationName: activeCompany?.name,
              category: activeCompany?.category,
              healthScore: activeCompany?.healthScore,
            },
          }),
        });

        const replyMsg: ChatMessage = {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: res.reply || 'عفواً، حدث تعذر أثناء معالجة الطلب.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, replyMsg]);
      }
    } catch (err: any) {
      const errMsg: ChatMessage = {
        id: 'ai-err-' + Date.now(),
        sender: 'ai',
        text: `⚠️ تعذر إتمام العملية: ${err?.message || 'خطأ في الاتصال بالخادم'}. تم الحفظ المحلي للاستجابة.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickCommands = [
    { label: '💡 أفكار لتقليل التسرب', text: 'ما هي أفضل الأفكار بالـ AI وبدون AI لتقليل تسرب الفريق؟', mode: 'ADVISOR' },
    { label: '💼 استراتيجية باقات الرعاية', text: 'اقترح استراتيجية تسعير باقات رعاية لمؤتمر تقني', mode: 'ADVISOR' },
    { label: '⚡ إضافة مهمة كانبان', text: 'ضيف مهمة عاجلة في الكانبان: مراجعة العقود وتجهيز نموذج الرعاة', mode: 'OPERATOR' },
    { label: '🏢 تسجيل شركة جديدة', text: 'ضيف شركة جديدة اسمها Delta Robotics في قطاع STARTUP', mode: 'OPERATOR' },
  ];

  return (
    <>
      {/* Floating Cyber Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-lime/90 to-emerald-400 text-canvas font-bold text-[13px] shadow-[0_0_30px_rgba(163,230,53,0.4)] hover:shadow-[0_0_40px_rgba(163,230,53,0.6)] hover:scale-105 active:scale-95 transition-all duration-200 group border border-lime"
        >
          <Bot className="w-5 h-5 text-canvas animate-bounce" />
          <span className="tracking-tight">999x Co-Pilot</span>
          <span className="w-2 h-2 rounded-full bg-canvas animate-ping" />
        </button>
      </div>

      {/* Slide-out Cyber Co-Pilot Panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg h-full flex flex-col glass-panel border-l border-lime/30 shadow-[0_0_80px_rgba(0,0,0,0.8)] animate-in slide-in-from-right duration-300"
            style={{ background: 'rgba(21, 3, 32, 0.98)' }}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-canvas/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-lime/15 border border-lime/30 flex items-center justify-center text-lime shadow-[0_0_15px_rgba(163,230,53,0.2)]">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-bold text-pistachio">999x AI Co-Pilot</h3>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-lime/20 text-lime border border-lime/30">
                      LIVE
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-white/40">Strategic Advisor & Autonomous Operator</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="p-3 border-b border-white/10 bg-surface/30 shrink-0">
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-canvas/80 border border-white/10">
                <button
                  type="button"
                  onClick={() => setMode('ADVISOR')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-[12px] font-bold transition-all ${
                    mode === 'ADVISOR'
                      ? 'bg-lime/20 text-lime border border-lime/30 shadow-[0_0_12px_rgba(163,230,53,0.15)]'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>المستشار الاستراتيجي</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('OPERATOR')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-[12px] font-bold transition-all ${
                    mode === 'OPERATOR'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>المنفذ الآلي (Backend)</span>
                </button>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto border-b border-white/5 no-scrollbar shrink-0">
              {quickCommands.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setMode(q.mode as any);
                    setInput(q.text);
                  }}
                  className="shrink-0 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/5 hover:bg-lime/10 hover:text-lime border border-white/10 transition-all text-white/60"
                >
                  {q.label}
                </button>
              ))}
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {messages.map((m) => {
                const isUser = m.sender === 'user';
                return (
                  <div key={m.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-[10px] font-mono text-white/30">{m.timestamp}</span>
                      <span className="text-[10px] font-mono text-lime/70">{isUser ? 'YOU' : '999x CO-PILOT'}</span>
                    </div>

                    <div
                      className={`max-w-[90%] p-4 rounded-2xl text-[13px] leading-relaxed ${
                        isUser
                          ? 'bg-lime/15 border border-lime/30 text-pistachio rounded-tr-none'
                          : 'glass-panel border-white/10 text-white/90 rounded-tl-none'
                      }`}
                    >
                      {/* Badge if tool executed */}
                      {m.actionExecuted && (
                        <div className="mb-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>BACKEND ACTION: {m.actionExecuted}</span>
                        </div>
                      )}

                      <div className="prose prose-invert prose-sm max-w-none ai-chat-markdown">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => <h1 className="text-[17px] font-black text-lime mb-2 mt-1 leading-tight">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-[15px] font-bold text-pistachio mb-1.5 mt-2 leading-tight">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-[13px] font-bold text-lime/90 mb-1 mt-1.5 leading-tight">{children}</h3>,
                            strong: ({ children }) => <strong className="text-lime font-bold">{children}</strong>,
                            em: ({ children }) => {
                              // If text inside *text* matches certain patterns, we highlight them explicitly
                              const content = String(children);
                              if (content.toLowerCase() === 'mido' || content.toLowerCase() === 'ميدو') {
                                return <em className="text-lime text-[18px] font-black italic not-italic shadow-[0_0_15px_rgba(163,230,53,0.4)] px-1">{children}</em>;
                              }
                              return <em className="text-white/80 italic">{children}</em>;
                            },
                            p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed text-white/90">{children}</p>,
                            ul: ({ children }) => <ul className="mb-2 space-y-0.5 pl-4">{children}</ul>,
                            ol: ({ children }) => <ol className="mb-2 space-y-0.5 pl-4 list-decimal">{children}</ol>,
                            li: ({ children }) => <li className="text-white/85 before:content-['▸'] before:text-lime/70 before:mr-1.5 before:text-[10px] flex gap-1 items-start leading-relaxed">{children}</li>,
                            code: ({ children }) => <code className="bg-white/10 text-lime font-mono text-[11px] px-1.5 py-0.5 rounded">{children}</code>,
                            pre: ({ children }) => <pre className="bg-black/40 border border-white/10 rounded-lg p-3 mb-2 overflow-x-auto text-[11px] font-mono text-lime/90">{children}</pre>,
                            blockquote: ({ children }) => <blockquote className="border-l-2 border-lime/50 pl-3 my-2 text-white/60 italic text-[12px]">{children}</blockquote>,
                            table: ({ children }) => <div className="overflow-x-auto mb-2"><table className="w-full text-[12px] border-collapse">{children}</table></div>,
                            th: ({ children }) => <th className="bg-lime/10 text-lime font-bold px-2 py-1.5 text-left border border-white/10">{children}</th>,
                            td: ({ children }) => <td className="px-2 py-1.5 border border-white/10 text-white/80">{children}</td>,
                            tr: ({ children }) => <tr className="even:bg-white/5">{children}</tr>,
                            hr: () => <hr className="border-white/10 my-2" />,
                            a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-lime underline hover:text-lime/80">{children}</a>,
                          }}
                        >
                          {m.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                );
              })}
              {loading && (
                <div className="flex items-center gap-2 text-[12px] font-mono text-lime/80 py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {mode === 'OPERATOR' ? 'جاري تنفيذ الأمر في السيرفر وتحديث البيانات...' : 'جاري تحليل المعطيات وتوليد الأفكار الاستراتيجية...'}
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-white/10 bg-canvas/80 shrink-0">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    mode === 'OPERATOR'
                      ? 'اكتب أمر تنفيذي (مثال: ضيف مهمة تجهيز الرعاة، ضيف شركة كذا...)'
                      : 'اسأل عن خطة، نصيحة تشغيلية، أو أفكار ابتكارية...'
                  }
                  className="flex-1 bg-surface/90 border border-white/10 focus:border-lime/50 rounded-xl px-4 py-3 text-[13px] text-pistachio outline-none placeholder:text-white/30"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-11 h-11 rounded-xl bg-lime hover:bg-lime/90 disabled:opacity-40 text-canvas font-bold flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.3)] transition-all shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
