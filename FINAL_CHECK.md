# 999x — Final Check (2026-09-06)

## Build
- `apps/web: bun run build` → ✓ Complete (8.11s, 40 modules)
- `apps/api: bun src/index.ts` → [999x] demo mode — Atlas detected, using mock DB (no 10s timeout)
- `GET /health → 200`, `POST /api/clients/register → 201`, `GET /api/admin/cockpit → 200 []`

## Landing
- `index.html` (157k) و `apps/web/public/index.html` طبق الأصل
- `apps/web/src/pages/index.astro` Astro wrapper via readFileSync + set:html — يخدم نفس المحتوى عبر BaseLayout
- كل الأزرار حقيقية: `999x_pulse`, `999x_leads`, `999x_wizard`, `999x_client`, `999x_bento`, `999x_downloads` في localStorage
- Bilingual: 181 data-i18n + 55 minimax references

## Model
- `minimax/minimax-m3:free` في كل مكان: `openrouter.gateway.ts:46`, `ai.contract.ts:4`, `admin.routes.ts`, `PromptStudio`, `index.html`

## No Dummy Data
- CRM: empty → `📭 لا يوجد عملاء`
- Dashboard: empty → `لا يوجد عميل — ابدأ من /onboarding`
- Tickets: empty → `لا توجد تذاكر`
- Kanban: empty → `📋 لا توجد مهام`
- API: يرجع `[]` بدون _mock عرض، فقط 201/404/200

## Run
```
cd apps/api && bun run dev  # 3001
cd apps/web && bun run dev  # 4321
open http://localhost:4321/                 # Landing Astro
open http://localhost:4321/index.html       # Landing static
open http://localhost:4321/onboarding       # Wizard 4 steps — التالي يعمل
open http://localhost:4321/client/dashboard # حقيقي من API + LS
open http://localhost:4321/admin/cockpit    # حقيقي
```
