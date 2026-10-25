---
title: "Load the Tailwind CSS and Astro plugins in the preset"
release_note: "The preset now sorts Tailwind classes, including in `.astro` files and `cn()`/`clsx()` calls, with `prettier-plugin-tailwindcss` and `prettier-plugin-astro` built in. Consumers no longer install the plugins, set `tailwindStylesheet` for their Tailwind v4 entry point, and need Prettier 3.7 or later."
created_at: "2026-10-24T15:19:26Z"
merged_at:
branch: "r-2931-load-prettier-plugin-tailwindcss-in-the-shared-preset-with-a"
pr:
commit:
author: "rob@rheged.studio"
co_authors: []
category: feature
breaking: false
issues: ["R-2931"]
affected_packages: []
stats:
  files_changed:
  loc_added:
  loc_removed:
  commits:
---

## Added

- `prettier-plugin-tailwindcss` and `prettier-plugin-astro` are built into the preset as its own dependencies, resolved by absolute path with Tailwind last, so consumers never install them ([R-2934](https://linear.app/rheged-studio/issue/R-2934) D2, D8, D13).
- `tailwindFunctions: ["cn", "clsx"]` and an `.astro` parser override.
- Fixtures and tests for Tailwind sorting in tsx, html, css and astro, for a `tailwindStylesheet` consumer with a v4 `@theme` utility, and for plugin loading without the consumer installing the plugins ([R-2911](https://linear.app/rheged-studio/issue/R-2911)).
- README sections on the built-in plugins, `tailwindStylesheet` (including per-app monorepo overrides) and the Astro plugin pin.

## Changed

- The `prettier` peer floor rises to `>=3.7.0`: `prettier-plugin-tailwindcss` 0.8 crashes on Prettier 3.5–3.6 despite declaring `^3.0` (D12).
- `prettier-plugin-astro` is pinned to `~0.14.1`: 1.x stops Tailwind sorting `.astro` classes (D11).
- The template's bare `prettier-plugin-tailwindcss` devDependency is gone.
