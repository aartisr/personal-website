# Aarti Sri Ravikumar — Student Research Portfolio

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
