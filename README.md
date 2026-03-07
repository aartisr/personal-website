# Aarti Sri Ravikumar — Student Portfolio

A visual, CMS-editable student portfolio built with **Next.js 16**, **Puck CMS**, and reusable shared UI components.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Puck CMS (`@puckeditor/core`)
- Tailwind CSS v4
- Local shared UI blocks in `packages/shared-ui`

## Positioning

- Student-focused personal website with a clear and modern voice
- GitHub-first portfolio flow for projects and collaboration
- Support + legal pages aligned for trust and transparency

## Getting Started

```bash
bun install
bun dev
```

Open `http://localhost:3000` for the site.

## Visual Editor

- `http://localhost:3000/admin` — page dashboard
- `http://localhost:3000/admin/edit` — edit homepage
- `http://localhost:3000/admin/edit/<slug>` — edit any page by slug

## Key Content Pages

- `/` — homepage (student portfolio)
- `/support-center` — onboarding/help/collaboration support
- `/testimony` — roadmap and social-proof page
- `/privacy-policy` — privacy commitments
- `/terms-of-service` — legal terms

## Project Structure

- `content/` — page JSON data
- `packages/shared-ui/` — reusable Puck components
- `src/app/` — app routes and APIs
- `src/lib/` — render + content utilities

## Profile Source

- GitHub profile: `https://github.com/aartisr`

## Scripts

- `bun dev` — start development server
- `bun run build` — production build
- `bun start` — run production build
- `bun lint` — lint project
