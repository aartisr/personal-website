# Architecture and Boundaries

This repository is a content-driven Next.js academic portfolio app with reusable block components, shared configuration packages, and metadata helpers that make page content legible to search engines, social platforms, and AI answer systems.

## Layered Structure

1. App layer (`src/app`, `src/lib`)

- Owns routing, API handlers, and runtime orchestration.
- Reads/writes content files and applies request-level validation rules.
- Composes UI blocks through Puck configuration.
- Derives page metadata, JSON-LD, sitemap, robots, manifest, and social image routes.
- Serves live provider data, such as GitHub metrics, through cached API routes instead of blocking page render.
- Uses src/lib/content/page-repository.ts as the only filesystem-backed page-content boundary; routes do not construct content paths or parse page JSON.

1. Shared UI layer (`packages/shared-ui`)

- Owns reusable visual components and block configuration primitives.
- Exposes stable block contracts and helper utilities used by app runtime code.
- Must stay framework-agnostic where possible (no route-level business logic).
- Provides generic academic blocks such as `ResearchShowcase` for evidence, method, outcome, and artifact links.
- Provides generic metric hydration hooks: blocks can opt into async values with `metricKey` + `dynamicMetricsEndpoint` while preserving static fallback copy.

1. Site config layer (`packages/site-config`)

- Owns theme presets and CSS generation utilities.
- Provides design-system level primitives, not runtime route behavior.

1. Content layer (`content/*.json`)

- Owns user-editable page data.
- Treated as untrusted input at runtime; always validate and use defensive defaults.

## Dependency Direction

Allowed dependency flow:

`src/app` and `src/lib` -> `packages/shared-ui` / `packages/site-config` -> `content`

Rules:

- `packages/shared-ui` must not import from `src/app` or `src/lib`.
- Shared contracts live in shared packages and are consumed by app code.
- Avoid duplicating domain constants in multiple layers.
- Keep route-specific checks in API handlers, not inside generic UI components.

## Runtime Safety Rules

- Parse content defensively: malformed JSON should not crash page listing/render flows.
- Homepage writes must pass integrity guards unless explicitly forced by admin intent.
- UI blocks should tolerate missing optional fields through safe defaults.
- Utility helpers should prefer `unknown` + narrowing over `any`.

## Maintainability Guidelines

- Keep each module focused on one concern.
- Promote repeated literals and cross-layer rules to shared contracts.
- Add tests for guardrails and regression-prone content workflows.
- Prefer explicit types at API boundaries and block summaries.
- Add new content sections as generic Puck blocks when they could be reused on more than one page.
- Keep SEO/GEO data derived from page content where possible; use root props only for explicit overrides.

Shared UI links and editor-provided text are normalized through packages/shared-ui/src/utils rather than copied into each block.

## SEO/GEO Model

- Page metadata is derived in `src/lib/seo.ts` from root props and the leading hero block.
- Puck pages emit `WebSite`, `Person`, `ProfilePage`/`WebPage`, `BreadcrumbList`, optional `FAQPage`, and optional `ItemList` JSON-LD.
- Blog posts emit article metadata at the route level.
- `llms.txt` provides a concise machine-readable summary of site purpose, pages, topics, and preferred attribution.
- Stale static `robots.txt` and `sitemap.xml` files should not be reintroduced; generated app routes are the source of truth.

## Performance Model

- Known Puck pages are statically generated from `content/*.json` via `generateStaticParams`.
- Third-party data is never fetched in the page route. The page ships editorial fallback values first, then client components fetch dynamic metrics during browser idle time.
- `src/app/api/github-stats/route.ts` wraps GitHub data behind cache headers, an in-memory server cache, and a timeout fallback that returns an empty metric map instead of delaying the UI.
- Shared UI components must stay provider-neutral. GitHub is represented as an endpoint payload, not as hard-coded route behavior inside visual components.
- Below-the-fold sections use browser rendering containment where possible so long pages remain responsive on laptops and mobile devices.

## Refactoring Conventions

- Use pageRepository for page reads, writes, listings, and deletes. The get-page-data module is a backward-compatible facade only.
- Keep route handlers thin: parse request context, call a domain guard or repository, then map the outcome to HTTP.
- Put page-save protection rules in page-integrity so they can be unit-tested without importing a route.
- Use the shared-ui text and link utilities whenever editor-provided strings or URLs are rendered.
- Prefer small compatibility facades during internal migrations so stable import paths do not force unrelated changes.

## Extension Checklist

When adding a new block or route behavior:

1. Define/reuse shared constants and types in `packages/shared-ui` when reused across layers.
2. Keep editor-only configuration in block config files.
3. Add validation in API routes for critical content constraints.
4. Add tests for malformed content and minimal valid payloads.
5. Run `npm run quality` before merging.
