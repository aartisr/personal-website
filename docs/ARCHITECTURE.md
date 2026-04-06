# Architecture and Boundaries

This repository is a content-driven Next.js portfolio app with reusable block components and shared configuration packages.

## Layered Structure

1. App layer (`src/app`, `src/lib`)

- Owns routing, API handlers, and runtime orchestration.
- Reads/writes content files and applies request-level validation rules.
- Composes UI blocks through Puck configuration.

1. Shared UI layer (`packages/shared-ui`)

- Owns reusable visual components and block configuration primitives.
- Exposes stable block contracts and helper utilities used by app runtime code.
- Must stay framework-agnostic where possible (no route-level business logic).

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

## Extension Checklist

When adding a new block or route behavior:

1. Define/reuse shared constants and types in `packages/shared-ui` when reused across layers.
2. Keep editor-only configuration in block config files.
3. Add validation in API routes for critical content constraints.
4. Add tests for malformed content and minimal valid payloads.
5. Run `npm run quality` before merging.
