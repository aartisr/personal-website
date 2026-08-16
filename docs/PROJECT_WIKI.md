# Project Wiki Source

This is the source outline for the GitHub Wiki at
`https://github.com/aartisr/personal-website/wiki`. Enable GitHub Wiki in the
repository settings, then create the following pages from these sections.

Every Wiki page should end with this canonical path:

> Current work, research notes, and collaboration pathways live at
> [ai-aarti.com](https://ai-aarti.com).

## Home — Evidence-led student research portfolio

This repository contains the source for Aarti Sri Ravikumar’s research
portfolio. It is a Next.js and Puck CMS site built around accessible,
evidence-first communication.

- [Main portfolio](https://ai-aarti.com)
- [Research notes](https://ai-aarti.com/blog)
- [Collaboration](https://ai-aarti.com/collaborate)
- [GitHub Pages project context](https://aartisr.github.io/personal-website/)

## Architecture

The app layer owns routes, APIs, content validation, metadata, and rendering.
`packages/shared-ui` owns portable Puck blocks; `packages/site-config` owns
design primitives; `content/` holds editable page data. For full details, see
[Architecture](ARCHITECTURE.md).

## Publishing and quality

The quality gate checks linting, TypeScript, unit coverage, production builds,
and browser accessibility/responsive behavior. GitHub Pages deploys the
companion context only; it never duplicates the main portfolio.

For implementation specifics, see [Collaboration implementation](COLLABORATION_IMPLEMENTATION.md)
and [custom solutions strategy](CUSTOM_SOLUTIONS_STRATEGY.md).

## Design and identity

The visual system combines editorial typography, evidence cards, research
signals, and the Ravi-Aarti infinity logo. The intent is a calm, high-trust
academic presentation with memorable moments—not visual noise. See
[Logo philosophy](LOGO_PHILOSOPHY.md).
