---
title: "Scaffold the config-only @rheged-studio/prettier-config repo"
release_note:
created_at: "2026-10-24T14:56:46Z"
merged_at:
branch: "r-2933-scaffold-rheged-studioprettier-config-from-npm-package"
pr:
commit:
author: "rob@rheged.studio"
co_authors: []
category: chore
breaking: false
issues: ["R-2933"]
affected_packages: []
stats:
  files_changed:
  loc_added:
  loc_removed:
  commits:
---

## Added

- Initialised the repo from npm-package-template: package identity for `@rheged-studio/prettier-config`, a reset `changelog/`, the pulled shared agent skills and their generated configs (Linear key `R`), and an adapted `GLOSSARY.md`.

## Changed

- Stripped the template's build leg to make the package config-only: no `src/`, no `tsc` build, `build: false` in `ci.yml` and `pkg-release.yml`, and a typecheck lane over `tsconfig.tools.json`.
- `files` and `exports` ship only `README.md` and `./package.json` until the preset lands ([R-2935](https://linear.app/rheged-studio/issue/R-2935)).
- Documented the dormant release state in `CLAUDE.md` and `README.md`: the `v0.0.0` baseline tag and Clacks `release: null` (registration pending in rheged-studio/clacks#178) keep `Release` from publishing until the first publish ([R-2936](https://linear.app/rheged-studio/issue/R-2936)), while `changelog-enrich` still runs.
- Documented in `CLAUDE.md` that tsconfig `extends` inherits `files`/`include`/`exclude` from the base config unless the extending config sets its own, so the tooling configs restate them to override the inherited values.
