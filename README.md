# Open Lovable

Chat with AI to build React apps instantly. An example app made by the [Firecrawl](https://firecrawl.dev/?ref=open-lovable-github) team. For a complete cloud solution, check out [Lovable.dev](https://lovable.dev/) ❤️.

<img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmZtaHFleGRsMTNlaWNydGdianI4NGQ4dHhyZjB0d2VkcjRyeXBucCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZFVLWMa6dVskQX0qu1/giphy.gif" alt="Open Lovable Demo" width="100%"/>

## Setup

This is the `MShehrozJamshaid2/open-lovable` fork (branch `agent/mika/f059874bd543`). The app is a Next.js 15 (Turbopack) AI-powered website builder that uses Firecrawl scraping + Vercel/E2B sandboxing to clone or generate websites.

1. **Clone & Install**
```bash
git clone https://github.com/MShehrozJamshaid2/open-lovable.git
cd open-lovable
pnpm install  # or npm install / yarn install
```

2. **Add `.env.local`**

```env
# =================================================================
# REQUIRED
# =================================================================
FIRECRAWL_API_KEY=your_firecrawl_api_key    # https://firecrawl.dev

# =================================================================
# AI PROVIDER - Choose your LLM
# =================================================================
GEMINI_API_KEY=your_gemini_api_key        # https://aistudio.google.com/app/apikey
ANTHROPIC_API_KEY=your_anthropic_api_key  # https://console.anthropic.com
OPENAI_API_KEY=your_openai_api_key        # https://platform.openai.com
GROQ_API_KEY=your_groq_api_key            # https://console.groq.com

# =================================================================
# FAST APPLY (Optional - for faster edits)
# =================================================================
MORPH_API_KEY=your_morphllm_api_key    # https://morphllm.com/dashboard

# =================================================================
# SANDBOX PROVIDER - Choose ONE: Vercel (default) or E2B
# =================================================================
SANDBOX_PROVIDER=vercel  # or 'e2b'

# Option 1: Vercel Sandbox (default)
# Choose one authentication method:

# Method A: OIDC Token (recommended for development)
# Run `vercel link` then `vercel env pull` to get VERCEL_OIDC_TOKEN automatically
VERCEL_OIDC_TOKEN=auto_generated_by_vercel_env_pull

# Method B: Personal Access Token (for production or when OIDC unavailable)
# VERCEL_TEAM_ID=team_xxxxxxxxx      # Your Vercel team ID 
# VERCEL_PROJECT_ID=prj_xxxxxxxxx    # Your Vercel project ID
# VERCEL_TOKEN=vercel_xxxxxxxxxxxx   # Personal access token from Vercel dashboard

# Option 2: E2B Sandbox
# E2B_API_KEY=your_e2b_api_key      # https://e2b.dev
```

3. **Run**
```bash
pnpm dev  # or npm run dev / yarn dev (Next.js 15 with Turbopack; port 3000)
```

Open [http://localhost:3000](http://localhost:3000)

## Architecture — quick map

- **App**: Next.js 15 (`type: module`, Turbopack) — React 19 + Tailwind + shadcn/ui
- **Entry points**: `/` (home/scrape) → `/generation` (builder with sandbox + AI chat) → `/builder` (demo page) → `/api/search`, `/api/scrape-website`, `/api/scrape-url-enhanced` (Firecrawl), `/api/create-ai-sandbox-v2` (sandbox)
- **Firecrawl**: `lib/sandbox/` (providers), `app/api/scrape-website/route.ts`, `app/api/search/route.ts` — key env: `FIRECRAWL_API_KEY`
- **AI providers**: `lib/ai/provider-manager.ts` (OpenAI / Anthropic / Groq / Google via `@ai-sdk/*`; also `AI_GATEWAY_API_KEY` for Vercel gateway)
- **Sandbox**: `lib/sandbox/factory.ts` — `vercel` (default / OIDC) or `e2b`; `SANDBOX_PROVIDER` env selects
- **Config**: `config/app.config.ts` (models, sandbox timeouts, UI settings)
- **Build**: `npm run build` (Next 15); `pnpm dev` for dev server

Verified setup notes:
- `pnpm install` (or `npm install`) installs `bun.lock` + `pnpm-lock.yaml` + `package-lock.json`; repo uses `pnpm` primarily.
- `.env.local` needs at minimum `FIRECRAWL_API_KEY` + one AI key (`GEMINI_API_KEY`/`ANTHROPIC_API_KEY`/`OPENAI_API_KEY`/`GROQ_API_KEY`) + either `SANDBOX_PROVIDER=vercel` + `VERCEL_OIDC_TOKEN`/`VERCEL_TOKEN` OR `SANDBOX_PROVIDER=e2b` + `E2B_API_KEY`.
- The `.env.example` in repo (line 23) lists `GROQ_API_KEY`; README lists 5 providers; both correct — just pick at least one.
- The original clone URL in README pointed to upstream `firecrawl/open-lovable`; corrected to `MShehrozJamshaid2/open-lovable` above.

## License

MIT