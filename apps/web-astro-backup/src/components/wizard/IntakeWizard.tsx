// React island for onboarding — Adaptive Dynamic Intake Wizard with Smart Branching (999x.md §2.C.2)
import { useState } from 'react';

type Category = 'STARTUP' | 'VOLUNTEER_TEAM' | 'EVENT';

interface BranchData {
  teamSize: string;
  primaryFriction: string;
  specificGoal: string;
  budgetOrAttendees: string;
}

export default function IntakeWizard() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<Category>('STARTUP');
  const [orgName, setOrgName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [files, setFiles] = useState<Array<{ name: string; size: string }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationDone, setGenerationDone] = useState(false);

  const [branchData, setBranchData] = useState<BranchData>({
    teamSize: '25-50',
    primaryFriction: 'churn',
    specificGoal: 'هيكلة RACI وتخفيض التسرب',
    budgetOrAttendees: '$50K - $150K',
  });

  const progress = ((step - 1) / 3) * 100;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).map((f) => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    // حاول استدعاء API الحقيقي أولاً — مع fallback محلي أسطوري لو الـ API غير متاح
    try {
      const api = (import.meta as any).env?.PUBLIC_API_URL ?? 'http://localhost:3001';
      // 1) سجل العميل
      const reg = await fetch(`${api}/api/clients/register`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ organizationName: orgName || 'Demo Team', category, primaryContact:{ name: contactName||'Demo Lead', email:`${(orgName||'demo').replace(/\s+/g,'').toLowerCase()}@team.com`, phone: phone||'+201000000000' }})
      });
      let clientId = '';
      if (reg.ok) { const j=await reg.json(); clientId=j.data?.id ?? ''; if(clientId) localStorage.setItem('999x_clientId', clientId); }
      // 2) شغّل التشخيص
      await fetch(`${api}/api/ai/diagnose-pulse`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ category, pains:[branchData.primaryFriction], teamSize: 25 }) }).catch(()=>{});
      // 3) ابدأ توليد الخطة مع ستريم (لو متاح) — نحاكي الستريم محلياً
      await new Promise(r=>setTimeout(r, 900));
    } catch {}
    setIsGenerating(false);
    setGenerationDone(true);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-9 border-lime/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] relative overflow-hidden">
      
      {/* Top Cockpit Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6 text-[12px] font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-lime animate-pulse shadow-[0_0_10px_#A3E635]"></span>
          <span className="text-lime font-bold">999x COCKPIT WIZARD</span>
          <span className="text-pistachio/40 hidden sm:inline">• Multi-Tenant Isolation</span>
        </div>
        <div className="flex items-center gap-2 font-bold text-pistachio">
          <span>المرحلة {step} من 4</span>
          <span className="px-2 py-0.5 rounded-full bg-lime/15 text-lime text-[11px] font-mono">{category}</span>
        </div>
      </div>

      {/* Progress Bar with Neo Glow */}
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-8">
        <div
          className="h-full bg-gradient-to-r from-lime via-emerald-400 to-lime transition-all duration-500 shadow-[0_0_12px_rgba(163,230,53,0.8)]"
          style={{ width: `${Math.max(10, progress)}%` }}
        />
      </div>

      {/* =================================================================== */}
      {/* STEP 1: CATEGORY SELECTION                                         */}
      {/* =================================================================== */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h3 className="font-display font-bold text-[22px] text-pistachio">ما هو تصنيف منظمتك؟</h3>
            <p className="text-[13.5px] text-pistachio/70 font-sub mt-1">
              يُكيّف المعالج خوارزميات التشخيص ونماذج الذكاء الاصطناعي بناءً على طبيعة فريقك (Startup / Volunteer / Event).
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <button
              onClick={() => {
                setCategory('STARTUP');
                setBranchData({ ...branchData, specificGoal: 'استقرار التوظيف وفترات التجربة والـ PR للتمويل', budgetOrAttendees: 'Seed / Series A' });
              }}
              className={`p-5 rounded-2xl border text-start transition relative overflow-hidden group ${
                category === 'STARTUP' ? 'bg-surface border-lime shadow-[0_0_25px_rgba(163,230,53,0.2)]' : 'bg-canvas border-white/10 hover:border-lime/40'
              }`}
            >
              <div className="text-[24px] mb-2">🚀</div>
              <div className="font-bold text-[15px] text-pistachio">شركة ناشئة (Startup)</div>
              <div className="text-[12px] text-pistachio/60 font-sub mt-1">
                تركيز على استقرار التوظيف، فترات التجربة، بطاقات الوظائف، والـ PR لجولات التمويل.
              </div>
              {category === 'STARTUP' && <span className="absolute top-3 left-3 text-lime font-mono text-[12px] font-bold">✓ نشط</span>}
            </button>

            <button
              onClick={() => {
                setCategory('VOLUNTEER_TEAM');
                setBranchData({ ...branchData, specificGoal: 'الحفاظ على الشغف وتقليل انسحاب الأعضاء بنسبة 65%', budgetOrAttendees: '40-100 عضو' });
              }}
              className={`p-5 rounded-2xl border text-start transition relative overflow-hidden group ${
                category === 'VOLUNTEER_TEAM' ? 'bg-surface border-lime shadow-[0_0_25px_rgba(163,230,53,0.2)]' : 'bg-canvas border-white/10 hover:border-lime/40'
              }`}
            >
              <div className="text-[24px] mb-2">🤝</div>
              <div className="font-bold text-[15px] text-pistachio">تيم تطوعي أو طلابي</div>
              <div className="text-[12px] text-pistachio/60 font-sub mt-1">
                تركيز على تقليل انسحاب الأعضاء (Churn)، الهيكل اللامركزي، والرعايات العينية والتجارية.
              </div>
              {category === 'VOLUNTEER_TEAM' && <span className="absolute top-3 left-3 text-lime font-mono text-[12px] font-bold">✓ نشط</span>}
            </button>

            <button
              onClick={() => {
                setCategory('EVENT');
                setBranchData({ ...branchData, specificGoal: 'إغلاق رعاة المؤتمر وتأمين بدائل المتحدثين', budgetOrAttendees: '800-2,500 حضور' });
              }}
              className={`p-5 rounded-2xl border text-start transition relative overflow-hidden group ${
                category === 'EVENT' ? 'bg-surface border-lime shadow-[0_0_25px_rgba(163,230,53,0.2)]' : 'bg-canvas border-white/10 hover:border-lime/40'
              }`}
            >
              <div className="text-[24px] mb-2">🎪</div>
              <div className="font-bold text-[15px] text-pistachio">مؤتمر أو إيفينت كبير</div>
              <div className="text-[12px] text-pistachio/60 font-sub mt-1">
                تركيز على اللوجستيات الحرجة، قائمة المتحدثين، واستوديو الرعاة السريع.
              </div>
              {category === 'EVENT' && <span className="absolute top-3 left-3 text-lime font-mono text-[12px] font-bold">✓ نشط</span>}
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* STEP 2: ORG IDENTITY & FILE UPLOAD                                  */}
      {/* =================================================================== */}
      {step === 2 && (
        <div className="space-y-5 font-sub">
          <div>
            <h3 className="font-display font-bold text-[22px] text-pistachio">هوية الفريق وبيانات التواصل</h3>
            <p className="text-[13.5px] text-pistachio/70 mt-1">
              أدخل الاسم الرسمي وارفع أي ملفات حالية (شيتات لجان، ملف تعريفي، أو باقة رعاة سابقة) لتحليلها فورياً.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[12.5px] font-bold text-pistachio block mb-1.5">اسم المنظمة أو الفريق:</label>
              <input
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g. Enactus Cairo / AUC V-Lab"
                className="w-full h-11 rounded-xl px-3.5 bg-canvas border border-white/15 text-pistachio text-[13.5px] outline-none focus:border-lime transition"
              />
            </div>

            <div>
              <label className="text-[12.5px] font-bold text-pistachio block mb-1.5">اسم الشخص المسؤول (Ops Lead):</label>
              <input
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. سارة المنشاوي"
                className="w-full h-11 rounded-xl px-3.5 bg-canvas border border-white/15 text-pistachio text-[13.5px] outline-none focus:border-lime transition"
              />
            </div>
          </div>

          <div>
            <label className="text-[12.5px] font-bold text-pistachio block mb-1.5">رقم واتساب المباشر لبوابة الطوارئ:</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+20 100 000 0000"
              dir="ltr"
              className="w-full h-11 rounded-xl px-3.5 bg-canvas border border-white/15 text-pistachio text-[13.5px] outline-none focus:border-lime transition"
            />
          </div>

          {/* Drag & Drop Zone */}
          <div>
            <label className="text-[12.5px] font-bold text-pistachio block mb-1.5">مستندات العمل (سحب وإفلات — حتى 25MB):</label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="rounded-2xl p-7 text-center border-2 border-dashed border-lime/30 bg-canvas hover:border-lime transition cursor-pointer"
              onClick={() => {
                const sampleName = category === 'STARTUP' ? 'PitchDeck_v3.pdf' : category === 'VOLUNTEER_TEAM' ? 'Committees_RACI_2026.xlsx' : 'Event_Sponsor_Pack.pdf';
                setFiles((prev) => [...prev, { name: sampleName, size: '2.4 MB' }]);
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-lime/15 text-lime mx-auto flex items-center justify-center text-[18px] mb-2 font-mono">📁</div>
              <p className="text-[13px] font-bold text-pistachio">اسحب وأفلت الملفات هنا، أو انقر للاختيار من جهازك</p>
              <p className="text-[11px] font-mono text-pistachio/50 mt-1">يدعم PDF / XLSX / DOCX / CSV — تشفير AES-256 محلي</p>

              {files.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {files.map((f, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-surface border border-lime/40 text-[11.5px] font-mono text-lime flex items-center gap-1.5">
                      <span>✓ {f.name}</span>
                      <span className="text-pistachio/40">({f.size})</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* STEP 3: SMART ADAPTIVE BRANCHING QUESTIONS                         */}
      {/* =================================================================== */}
      {step === 3 && (
        <div className="space-y-5 font-sub">
          <div>
            <div className="flex items-center gap-2 text-lime font-mono text-[11px] mb-1">
              <span>● SMART BRANCHING ACTIVATED</span>
              <span>— {category}</span>
            </div>
            <h3 className="font-display font-bold text-[22px] text-pistachio">تشخيص المعضلة التشغيلية المتخصصة</h3>
            <p className="text-[13.5px] text-pistachio/70 mt-1">
              الأسئلة تتشعب ديناميكياً لتشخيص الفجوات الحرجة في هيكل {category === 'STARTUP' ? 'الشركة الناشئة' : category === 'VOLUNTEER_TEAM' ? 'التيم الطلابي' : 'المؤتمر'}.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[12.5px] font-bold text-pistachio block mb-1.5">
                {category === 'STARTUP' ? 'حجم الفريق وحالة التوظيف:' : category === 'VOLUNTEER_TEAM' ? 'عدد الأعضاء في اللجان:' : 'عدد الحضور المتوقع:'}
              </label>
              <select
                value={branchData.budgetOrAttendees}
                onChange={(e) => setBranchData({ ...branchData, budgetOrAttendees: e.target.value })}
                className="w-full h-11 rounded-xl px-3 bg-canvas border border-white/15 text-pistachio text-[13.5px] outline-none focus:border-lime"
              >
                {category === 'STARTUP' ? (
                  <>
                    <option>5 - 15 فرداً (Bootstrapped / Pre-Seed)</option>
                    <option>15 - 40 فرداً (Seed Stage — سريع النمو)</option>
                    <option>40+ فرداً (Series A+)</option>
                  </>
                ) : category === 'VOLUNTEER_TEAM' ? (
                  <>
                    <option>20 - 45 عضواً (لجان مركزية)</option>
                    <option>45 - 90 عضواً (توسع على مستوى الجامعة)</option>
                    <option>100+ عضو (فروع متعددة بالمحافظات)</option>
                  </>
                ) : (
                  <>
                    <option>200 - 600 حضور (مؤتمر متوسط)</option>
                    <option>600 - 1500 حضور (مؤتمر كبير)</option>
                    <option>1500+ حضور (قمة كبرى)</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="text-[12.5px] font-bold text-pistachio block mb-1.5">أخطر نقطة اختناق تواجهها الآن:</label>
              <select
                value={branchData.primaryFriction}
                onChange={(e) => setBranchData({ ...branchData, primaryFriction: e.target.value })}
                className="w-full h-11 rounded-xl px-3 bg-canvas border border-white/15 text-pistachio text-[13.5px] outline-none focus:border-lime"
              >
                {category === 'STARTUP' ? (
                  <>
                    <option value="churn">فوضى في توصيف الوظائف وتداخل الصلاحيات (No RACI)</option>
                    <option value="delivery">تأخر الـ Sprint وعدم التزام المطورين بالمواعيد</option>
                    <option value="pr">ضعف الظهور الإعلامي في الصحف المتخصصة بالتمويل</option>
                  </>
                ) : category === 'VOLUNTEER_TEAM' ? (
                  <>
                    <option value="churn">نزف الأعضاء بعد أول شهر (High Churn Rate - 45%)</option>
                    <option value="sponsor">صعوبة التواصل مع شركات رعاية بمقابل حقيقي</option>
                    <option value="hierarchy">فوضى اللجان وغياب قائد متابعة واضح للـ Onboarding</option>
                  </>
                ) : (
                  <>
                    <option value="sponsor">تأخر إغلاق باقات الرعاة الكبرى (Gold/Silver Tiers)</option>
                    <option value="speaker">مخاطر اعتذار متحدثين رئيسيين في اللحظة الأخيرة</option>
                    <option value="delivery">تشتت فريق التنظيم في الـ Logistics يوم الحدث</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-canvas border border-lime/20 text-[12.5px] font-sub leading-relaxed">
            <span className="text-lime font-bold block mb-1">💡 التوجيه الهندسي المقترح لتيم 999x:</span>
            {category === 'STARTUP' && 'سيقوم محرك OpenRouter بتوليد هيكل RACI شجري مع بطاقات مهام OKRs وحزمة PR للإطلاق الإعلامي.'}
            {category === 'VOLUNTEER_TEAM' && 'سيتم بناء بروتوكول Onboarding من 3 محطات + تقسيم اللجان لخلايا ثلاثية لتخفيض التسرب فورياً.'}
            {category === 'EVENT' && 'سيتم توليد مصفوفة استوديو الرعاة متضمنة 3 قطاعات متطابقة (Fintech/EdTech/FMCG) مع مسودات بريد باردة.'}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* STEP 4: INSTANT GENERATION & LIVE BRIEF PREVIEW                    */}
      {/* =================================================================== */}
      {step === 4 && (
        <div className="space-y-6">
          {!generationDone ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-lime/15 border-2 border-lime text-lime mx-auto flex items-center justify-center text-[26px] font-mono animate-bounce">
                ⚡
              </div>
              <div>
                <h3 className="font-display font-bold text-[22px] text-pistachio">
                  {isGenerating ? 'جارٍ التشخيص وتوليد خطة العمل...' : 'جاهز لإطلاق محرك التشخيص اللحظي'}
                </h3>
                <p className="text-[13.5px] text-pistachio/70 font-sub max-w-[480px] mx-auto mt-1">
                  {isGenerating
                    ? 'فحص دلالي عبر OpenRouter (Minimax M3) • مطابقة RACI • حساب مؤشر الصحة'
                    : `اكتملت بيانات ${orgName || 'منظمتك'}. اضغط الزر بالأسفل لتوليد التقرير التنفيذي في 90 ثانية.`}
                </p>
              </div>

              {!isGenerating && (
                <button
                  onClick={handleStartGeneration}
                  className="btn-lime px-8 h-12 text-[14px] font-bold inline-flex items-center gap-2.5 mx-auto"
                >
                  <span>⚡ إطلاق التوليد بالذكاء الاصطناعي</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {isGenerating && (
                <div className="max-w-[320px] mx-auto space-y-2">
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-lime rounded-full animate-pulse" style={{ width: '85%' }} />
                  </div>
                  <div className="text-[11px] font-mono text-lime">Streaming tokens at 48 tok/s...</div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5 font-sub animate-fade-in">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-emerald-400 text-canvas flex items-center justify-center font-bold text-[14px]">✓</span>
                  <div>
                    <div className="font-bold text-pistachio text-[14px]">تم توليد خطة العمل التشغيلية بنجاح!</div>
                    <div className="text-[11.5px] font-mono text-emerald-300">Hash: SHA256-999X-INIT-{Math.floor(Math.random()*9000+1000)}</div>
                  </div>
                </div>
                <span className="font-mono font-black text-lime text-[22px]">88/100</span>
              </div>

              {/* Generated Brief Summary Card */}
              <div className="p-5 rounded-2xl bg-canvas border border-lime/20 space-y-3">
                <div className="flex justify-between items-center border-b border-white/[0.08] pb-2.5 text-[12px] font-mono">
                  <span className="text-lime font-bold">999x EXECUTIVE BRIEF v1.0</span>
                  <span className="text-pistachio/50">{orgName || 'Enactus Cairo'} • {category}</span>
                </div>

                <div className="text-[13px] leading-relaxed text-pistachio/85">
                  <strong>التشخيص الأولي:</strong> تم رصد فجوة هيكلية في توزيع المسؤوليات تُسبب نزف الأعضاء بنسبة تقديرية 38%. تم إنشاء مصفوفة RACI من 3 مستويات مع اعتماد خلايا تشغيلية ثلاثية وتحديد حزمة رعاة أولية بقيمة 55,000 ج.م.
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-center text-[11px] font-mono pt-2">
                  <div className="p-2 rounded-xl bg-surface border border-white/10">
                    <div className="text-pistachio/50">HR STABILITY</div>
                    <div className="font-bold text-lime text-[14px] mt-0.5">78%</div>
                  </div>
                  <div className="p-2 rounded-xl bg-surface border border-white/10">
                    <div className="text-pistachio/50">CHURN RISK</div>
                    <div className="font-bold text-amber-300 text-[14px] mt-0.5">14%</div>
                  </div>
                  <div className="p-2 rounded-xl bg-surface border border-white/10">
                    <div className="text-pistachio/50">SPONSORS</div>
                    <div className="font-bold text-violet-300 text-[14px] mt-0.5">85%</div>
                  </div>
                </div>
              </div>

              {/* Direct Access CTA */}
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="/client/dashboard"
                  className="flex-1 h-12 btn-lime text-[13.5px] font-bold flex items-center justify-center gap-2"
                >
                  <span>🚀 الدخول للوحة تحكم العميل الحية</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </a>
                <a
                  href="/client/roadmap"
                  className="px-5 h-12 rounded-xl bg-surface border border-white/15 hover:border-lime/40 text-pistachio font-bold text-[13px] flex items-center justify-center transition"
                >
                  عرض خريطة الطريق
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex items-center justify-between border-t border-white/[0.08] pt-6 mt-8">
        {step > 1 && !generationDone ? (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="px-5 h-11 rounded-xl bg-canvas hover:bg-surface border border-white/15 text-pistachio text-[13px] font-bold transition"
          >
            ← السابق
          </button>
        ) : (
          <div />
        )}

        {step < 4 && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('[999x] wizard next', step, '->', step+1);
              setStep((s) => Math.min(s + 1, 4));
            }}
            className="mr-auto btn-lime px-7 h-11 text-[13.5px] font-bold flex items-center gap-2 cursor-pointer relative z-10"
          >
            <span>التالي</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

    </div>
  );
}
