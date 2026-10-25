---
title: "Ship the pinned-defaults preset and shared ignore list"
release_note: "Adds `@rheged-studio/prettier-config`: a Prettier preset that pins every formatting option to Prettier's default, plus a shared `prettierignore` for `--ignore-path`."
created_at: "2026-10-24T15:13:03Z"
merged_at:
branch: "r-2935-author-the-v1-preset-fixture-tests-and-readme"
pr:
commit:
author: "rob@rheged.studio"
co_authors: []
category: feature
breaking: false
issues: ["R-2935"]
affected_packages: []
stats:
  files_changed:
  loc_added:
  loc_removed:
  commits:
---

## Added

- `index.mjs`, the preset: every Prettier formatting option pinned to Prettier's default ([R-2934](https://linear.app/rheged-studio/issue/R-2934) D1), typed with JSDoc and type-checked through `@rheged-studio/tsconfig`'s `node-tooling` preset.
- `prettierignore`, the shared ignore list (D9), covering lockfiles, build and tool output, vendored agent skills and changelogs.
- `exports` for `.`, `./prettierignore` and `./package.json`, and a `prettier >=3.5.3` peer dependency with no upper cap (D12).
- Pack-and-install tests: the tarball runs in consumers on Prettier 3.5.3 and on the repo's version, against formatted, unformatted and ignored fixtures, with a guard that every pin equals Prettier's default.
- README sections on installing, using, overriding, the shared ignore list, versioning and the test harness.

## Changed

- The repo formats itself with its own preset (`prettier.config.mjs`) and lints the preset files locally and in CI.
