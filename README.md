# 999x Operations & Client Hub — Neo-Cyber Executive Platform

> **طبق الأصل من المخطط الهندسي `999x.md` — منصة تشغيلية ذكية (HR / PR / Sponsorship / Operations)**

## البنية (Clean Architecture — Monorepo)
```
999x-enterprise-platform/
├─ apps/web  (Astro 4 + Tailwind — Zero-JS Islands, <0.4s FCP)
│  ├─ src/pages/index.astro  ← طبق الأصل من /index.html (legendary landing)
│  ├─ src/pages/onboarding.astro  (Adaptive Intake Wizard)
│  ├─ src/pages/client/{dashboard,roadmap,tickets}.astro
│  ├─ src/pages/admin/{cockpit,ai-studio,crm}.astro
│  ├─ src/components/ui, landing, wizard, client, admin
│  ├─ src/layouts/{BaseLayout,DashboardLayout}.astro
│  └─ src/styles/globals.css (tokens: #150320, #A3E635, #F3F8CC, #8B5CF6)
├─ apps/api  (Bun + Hono — 3x faster I/O)
│  ├─ src/core/{entities,value-objects,repositories}
│  ├─ src/application/use-cases/{client,ai,ops}
│  ├─ src/infrastructure/{database,ai,cache,messaging,pdf}
│  └─ src/presentation/{controllers,middlewares,routes}
├─ packages/contracts  (Result<T,E> + Zod)
└─ packages/ui-kit  (tokens)
```

## التصميم — Neo-Cyber Executive (frozen)
- **Canvas** `#150320` / **Surface** `#220633` / **Elevated** `#300A48`
- **Lime** `#A3E635` (CTAs) / **Pistachio** `#F3F8CC` / **Violet** `#8B5CF6` (glow)
- Fonts: `Unbounded` + `Alexandria` (AR headings) / `Plus Jakarta Sans` + `IBM Plex` (body) / `JetBrains Mono` (KPIs)
- Glass `blur(24px)` + `spotlight` يتبع الماوس + `beveled` angles من اللوجو
- Landing طبق الأصل من `/index.html` (1643 سطر) — نفس الـ hero 3D, Pulse 360°, Bento 4 محركات, roadmap, war-room teaser, marquee, grain/vignette, scroll progress, bilingual AR/EN كامل.

## التشغيل المحلي
```bash
# 1) المتطلبات
bun -v; node -v
docker compose up -d mongodb redis

# 2) التثبيت
bun install

# 3) المتغيرات
cp apps/api/.env.example apps/api/.env  # ضع OPENROUTER_API_KEY, JWT_SECRET, MONGODB_URI

# 4) التشغيل
bun run dev          # web :4321 + api :3001 (concurrent)
# أو منفصل
bun --filter web dev
bun --filter api dev

# 5) البناء
bun run build
```

## الـ API (Hono)
| Method | Route | Guard |
|--------|-------|-------|
| POST | `/api/auth/login` | public |
| POST | `/api/clients/register` | public (wizard) |
| GET | `/api/clients/:id/roadmap` | auth + tenantIsolation |
| POST | `/api/clients/:id/pulse` | auth |
| POST | `/api/ai/diagnose-pulse` | auth + rateLimiter |
| POST | `/api/ai/generate-plan-stream` | auth (SSE `streamText`) |
| POST | `/api/ai/sponsor-studio` | auth |
| POST | `/api/ai/generate-report` | auth |
| GET | `/api/admin/cockpit` | OPS_MEMBER |
| GET | `/api/admin/ai-studio` | OPS_MEMBER |
| POST | `/api/webhooks/whatsapp` | public (verify_token) |

**Security Layers (md:344):** WAF/CORS/RateLimit → Dual JWT (HttpOnly Secure SameSite=Strict, RS256 15m + Rotation 7d) → tenantIsolation (IDOR guard) → Zod sanitization → AuditLog Vault.

## قواعد البيانات (7 Schemas)
`User` / `Client` / `Submission` / `AIReport` (compound index `{clientId:1, reportType:1, createdAt:-1}`) / `Task` / `Ticket` / `AuditLog` — `.lean()` في كل قراءة.

## محرك الذكاء (OpenRouter)
- Gateway `openrouter.gateway.ts` — fallback محلي + Semantic Cache (MD5 hash, 14d TTL, 15ms, 60% توفير) + L1 Redis.
- Models: `claude-3.5-sonnet` (خطط) / `gpt-4o` (تلخيص) / `deepseek-r1` (تفكير منطقي).
- SSE streaming `hono/streaming` — أول token <1s.

## التحقق
```bash
biome check .         # lint
tsc --noEmit          # typecheck (web + api + contracts)
bun --filter web build # Astro build
```

> اللاندينج الأصلية محفوظة في `/index.html` وفي `apps/web/src/pages/index.astro` طبق الأصل — نفس التوكنز، نفس الخطوط، نفس الحركات، نفس البايلنجوال AR/EN الكامل (50 عنصر مترجم + radar + typewriter).
