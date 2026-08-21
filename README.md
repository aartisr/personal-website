# Aarti Sri Ravikumar — Student Research Portfolio

[![Ravi-Aarti Infinity Logo](public/ravi-aarti-infinity-logo.svg)](docs/LOGO_PHILOSOPHY.md)

**[Read the logo meaning and symbolism](docs/LOGO_PHILOSOPHY.md)**

A CMS-editable academic research portfolio built with **Next.js 16**, **Puck CMS**, reusable shared UI components, and search/social metadata designed for humans, crawlers, and AI answer engines.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Puck CMS (`@puckeditor/core`)
- Tailwind CSS v4
- Local shared UI blocks in `packages/shared-ui`

## Positioning

- Academic student research portfolio with a clear evidence-first voice
- Reviewer-friendly routes for research, methods, writing, journey, proof, and collaboration
- GitHub-first evidence model with structured project context and public writing
- SEO/GEO foundation with dynamic metadata, structured data, sitemap, robots, social card, and `llms.txt`
- Static-first rendering with async metrics hydration so third-party APIs never block the first page render

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` for the site.

## Visual Editor

- `http://localhost:3000/admin` — page dashboard
- `http://localhost:3000/admin/edit` — edit homepage
- `http://localhost:3000/admin/edit/<slug>` — edit any page by slug
- `http://localhost:3000/admin/edit/blog` — edit the blog landing page, discovery copy, and calls to action
- `http://localhost:3000/admin/edit/web3-proof` — edit the wallet-proof page while preserving the verification control
- `http://localhost:3000/admin/edit/honors-service` — edit the Recognition Ledger and add verified future accomplishments
- `http://localhost:3000/admin/edit/layout` — global layout hub
- `http://localhost:3000/admin/edit/layout/header` — edit global reusable header component
- `http://localhost:3000/admin/edit/layout/footer` — edit global reusable footer component

Puck page JSON files are stored in `content/pages/`.

If you still have legacy page JSON files in `content/*.json`, migrate them:

```bash
npm run migrate:pages        # dry-run
npm run migrate:pages:apply  # move files to content/pages
```

## Admin Protection

Admin routes and editor APIs are protected with HTTP Basic Auth via middleware:

- `/admin/*`
- `/api/pages`
- `/api/page/*`

Set these environment variables before running the app:

```bash
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_strong_password
```

If these values are missing, protected routes return `500` until configured.

## Key Content Pages

- `/` — homepage (student research portfolio)
- `/blog` — research notes and field memos
- `/support-center` — onboarding/help/collaboration support
- `/testimony` — roadmap and social-proof page
- `/web3-proof` — authenticity proof
- `/privacy-policy` — privacy commitments
- `/terms-of-service` — legal terms

## Project Structure

- `content/` — page JSON data
- `packages/shared-ui/` — reusable Puck components
- `src/app/` — app routes and APIs
- `src/lib/` — render, content, SEO, and metadata utilities

## Search and Social

- `src/lib/seo.ts` derives canonical metadata and JSON-LD from Puck content.
- `src/app/sitemap.ts` and `src/app/robots.ts` generate crawl configuration from the configured site URL.
- `src/app/opengraph-image.tsx` generates a branded 1200×630 social card.
- `public/llms.txt` summarizes the site for AI crawlers and answer engines.
- Blog posts include article metadata and share controls for LinkedIn, X, WhatsApp, email, native share, and copy link.

### IndexNow and search-console submission

The root verification file in `public/2f04bb3a2771437db8aba059ae4b2045.txt` proves ownership for IndexNow. It must be deployed and publicly reachable before submitting URLs.

After each meaningful production content update, use one of these intentional submission paths:

- Run the **Submit production URLs to IndexNow** GitHub Actions workflow after the Vercel deployment succeeds.
- Or set `INDEXNOW_NOTIFY_TOKEN` in Vercel and make a `POST` request to `/api/indexnow` with `Authorization: Bearer <token>`. The route submits only the canonical URLs currently in `sitemap.xml`.

Add `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and `NEXT_PUBLIC_BING_SITE_VERIFICATION` in the production environment after creating Google Search Console and Bing Webmaster Tools properties. The root layout emits the corresponding ownership tags automatically.

### GitHub Pages project context

The repository includes a lightweight, static project-context page in
github-pages/. It offers original source and implementation context, points
readers to the authoritative portfolio at [ai-aarti.com](https://ai-aarti.com),
and does not copy the portfolio’s pages.

To publish it, open **Settings → Pages** in GitHub and set the source to
**GitHub Actions**, then run the **Deploy GitHub Pages project context**
workflow. Its expected URL is https://aartisr.github.io/personal-website/.

Before publishing a private repository, confirm that the organization’s GitHub
plan and Pages policy permit private-repository Pages. The workflow uses the
official artifact-based Pages deployment actions and deploys only the
github-pages/ directory.

### Project wiki

The repository includes [wiki source material](docs/PROJECT_WIKI.md) for a
GitHub Wiki. Enable the repository Wiki in GitHub settings, then copy each
linked section into its matching Wiki page. The published GitHub Pages
companion links to the Wiki and routes readers back to the authoritative
[ai-aarti.com](https://ai-aarti.com) portfolio.

## Analytics

Microsoft Clarity is wired through `src/components/analytics/microsoft-clarity.tsx`.

Set the Clarity project ID in the production environment:

```bash
NEXT_PUBLIC_MICROSOFT_CLARITY_ID=your_clarity_project_id
```

The script is skipped when the ID is missing, so local builds and preview environments stay clean until analytics is intentionally enabled.

Microsoft notes that Clarity should not be used on websites or apps targeting users under 18 globally. Confirm the intended audience and privacy posture before enabling the production project ID.

### PostHog

PostHog is ready to use through Next.js client instrumentation in `src/instrumentation-client.ts`. Add the following to your deployment environment (and `.env.local` for local verification):

```bash
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=phc_your_project_token
# Omit for PostHog US Cloud; use https://eu.i.posthog.com for EU Cloud.
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

The integration loads only after the page is interactive, is disabled when the project token is missing, and has a `NEXT_PUBLIC_POSTHOG_ENABLED=false` kill switch. The Content Security Policy permits the official PostHog CDN, ingestion endpoint, and replay worker; a configured self-hosted host is added automatically at build time. Configure PostHog’s data-capture, session-replay, and consent settings to match the site’s privacy policy before enabling it in production.

For custom browser events, import `posthog` from `posthog-js` in client-side code and call `posthog.capture("event_name", { property: "value" })`. If this site later adds authentication, identify users only with a stable internal ID after consent, and reset identity at logout.

## Performance and Dynamic Metrics

- Puck content pages are statically generated from `content/*.json` and revalidated hourly.
- GitHub metrics are served by `src/app/api/github-stats/route.ts` with edge-friendly cache headers and a server timeout fallback.
- UI blocks stay generic: add `metricKey` to a hero proof point or stat item, and set `dynamicMetricsEndpoint` to any endpoint that returns `{ "metrics": { "<key>": { "value": "...", "prefix": "", "suffix": "" } } }`.
- The shared UI waits for browser idle time before fetching metrics, caches the result in the client module, and leaves editorial fallback values in place if the network is slow or unavailable.
- Static assets, the social image route, and the metrics route include cache-control headers in `next.config.ts`.

## Architecture

- Repository architecture and dependency boundaries: `docs/ARCHITECTURE.md`

## Profile Source

- GitHub profile: `https://github.com/aartisr`

## Scripts

- `npm run dev` — start development server
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — lint project
- `npm run typecheck` — strict TypeScript checks
- `npm run test` — run unit tests in watch mode
- `npm run test:ci` — run unit tests with coverage
- `npm run quality` — full quality gate (lint + types + tests + build)

## Engineering Quality Standard

This repo now enforces a quality gate intended for production reliability:

- CI workflow runs on every pull request and push to `main`/`master`
- Required checks: lint, type-check, unit tests with coverage, production build
- Security response headers are set at the framework level for all routes

CI workflow file:

- `.github/workflows/quality.yml`
