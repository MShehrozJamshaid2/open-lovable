# open-lovable — architecture map (fork: MShehrozJamshaid2/open-lovable)

Branch: `agent/mika/f059874bd543` (this checkout).

## What it does
Next.js 15 AI website builder. User enters a URL / search term on `/`, the app scrapes via Firecrawl (`FIRECRAWL_API_KEY`), creates a Vercel/E2B sandbox (`SANDBOX_PROVIDER`), and streams AI-generated React code into the sandbox (`/generation`). Supports brand-style extension, screenshot-based search, and direct code-application.

## Key modules / files
- `app/page.tsx` — home / input / search carousel
- `app/generation/page.tsx` — builder with sandbox, file explorer, AI chat, preview iframe
- `app/builder/page.tsx` — standalone demo builder page
- `app/landing.tsx` — landing variant
- `config/app.config.ts` — AI default model (`google/gemini-3-pro-preview`), sandbox timeouts, UI settings
- `lib/ai/provider-manager.ts` — provider resolution (`openai`/`anthropic`/`groq`/`google`; `AI_GATEWAY_API_KEY` overrides)
- `lib/sandbox/factory.ts`, `lib/sandbox/types.ts`, `lib/sandbox/providers/vercel-provider.ts`, `e2b-provider.ts` — sandbox creation / commands
- `app/api/search/route.ts`, `scrape-website/route.ts`, `scrape-url-enhanced/route.ts` — Firecrawl endpoints (requires `FIRECRAWL_API_KEY`)
- `app/api/create-ai-sandbox-v2/route.ts`, `apply-ai-code-stream/route.ts` — sandbox + code streaming
- `components/` — shadcn/ui + custom shared (hero-flame, header nav, sandbox preview, etc.)
- `package.json` — Next 15 (`"next": "15.5.27"`), React 19, `@mendable/firecrawl-js`, `ai` SDK, Tailwind 3.4

## Firecrawl integration points
- `FIRECRAWL_API_KEY` in `.env.local`
- Scrape: `app/api/scre-website/route.ts` uses `@mendable/firecrawl-js`; `app/api/scrape-url-enhanced/route.ts` uses direct `https://api.firecrawl.dev/v1/scrape` with `maxAge` caching
- Search: `app/api/search/route.ts` hits `https://api.firecrawl.dev/v1/search` with screenshot + markdown formats

## Setup verification
- `node --version` = v24.8.0 (compatible)
- `pnpm install` / `npm install` required; repo has `bun.lock` + `pnpm-lock.yaml` + `package-lock.json`
- `.env.local`: `FIRECRAWL_API_KEY` + at least one AI key (`GEMINI_API_KEY` / `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` / `GROQ_API_KEY`) + sandbox auth (`VERCEL_OIDC_TOKEN` or `VERCEL_TOKEN`+team/project for vercel; or `E2B_API_KEY` for e2b)
- `pnpm dev` runs on `localhost:3000` (Turbopack enabled via `--turbopack` in dev script)
- Build: `npm run build` (Next 15)

## Doc corrections applied on this branch
- `README.md`: clone URL fixed (was `firecrawl/open-lovable`; now `MShehrozJamshaid2/open-lovable`)
- `README.md`: added architecture quick-map + verified-setup notes (this file + README additions)
