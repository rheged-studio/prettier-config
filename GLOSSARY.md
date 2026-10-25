# prettier-config

Shared Prettier preset for the Rheged Studio estate: pinned Prettier defaults with the Tailwind CSS and Astro plugins built in.

## Language

### Release shell

**Version-of-record**:
The `version` in `package.json`, mirrored in `.release-please-manifest.json`, which is the repo's only statement of what release it is on. It is bumped by release-please and nothing else.
_Avoid_: Package version, build version

**Release PR**:
The `chore(main): release <version>` pull request that release-please opens on the `release-please--branches--main` branch. Merging it moves the version-of-record and sets up the publish.
_Avoid_: Version PR, bump PR

**Clacks**:
The estate's release orchestrator (`rheged-studio/clacks`). It opens and squash-merges the release PR once GO/NO GO is green; the merge then re-fires `pkg-release.yml`, which publishes.
_Avoid_: Orchestrator, release bot

**road-runner-bot**:
The org-wide GitHub App identity that Clacks and the changelog write-back act as. It is the only actor allowed to bypass the required-check and trunk rulesets.
_Avoid_: The bot, Roadrunner

**GO/NO GO**:
The single aggregator check-run that ends `ci.yml` and is the required check on `main`. It passes only when every real CI job succeeded or was skipped, and Clacks waits on it before merging a release PR.
_Avoid_: Build & Lint, CI gate, status check

### Preset

**Preset**:
The Prettier config object exported from `index.mjs` and consumed through `"prettier": "@rheged-studio/prettier-config"` or by spreading it in `prettier.config.mjs`.
_Avoid_: Prettierrc, shared config file

**Pinned defaults**:
The preset's rule that every Prettier formatting option is set explicitly to Prettier's own default (R-2934 D1), so adopting it reformats nothing and a Prettier default change needs a deliberate release.
_Avoid_: House style, opinions

**Built-in plugins**:
`prettier-plugin-astro` and `prettier-plugin-tailwindcss`, which the preset resolves from its own dependencies by absolute path, so consumers never install them (R-2934 D2, D8, D13).
_Avoid_: Peer plugins, plugin autoload

**Shared ignore list**:
The `prettierignore` file the package ships, passed to Prettier with `--ignore-path` alongside the repo's own ignore files (R-2934 D9).
_Avoid_: Shared .prettierignore

### Publishing

**Publish surface**:
What the package exposes to consumers: the preset module `index.mjs` and the shipped `prettierignore`, listed in `files` and `exports` (added in R-2935). There is no `src/` or `dist/`; everything else in the repo is shell and is not published.
_Avoid_: Public API, build output

**Trusted Publishing**:
npm's OIDC-based publish authentication, bound to this repo and the `pkg-release.yml` workflow filename, so CI publishes without any `NPM_TOKEN` secret.
_Avoid_: OIDC publish, token publish

**`npm-release` environment**:
The `main`-restricted GitHub environment that both privileged publish jobs run under, so only a ref on `main` can mint a publish credential.
_Avoid_: Release environment, publish environment

**Bootstrap publish**:
The manual first publish of a new package, done with a passkey, followed by the `v<initial>` tag and GitHub release. npm cannot configure Trusted Publishing until the package exists, so CI only takes over from publish number two.
_Avoid_: First release, initial publish

### Changelog

**Dated changelog**:
The `changelog/` directory, the repo's only changelog, holding one dated Markdown file per PR. There is no root `CHANGELOG.md`.
_Avoid_: CHANGELOG.md, release notes

**Changelog entry**:
One file in the dated changelog, named `<YYYYMMDD-HHMMSS>-<slug>.md`, written at PR time by `/send-it`. A non-release entry simply stays version-less.
_Avoid_: Changeset, release note

**Finalise**:
The post-merge step, run by `pkg-release.yml`'s `changelog-enrich` job in `mode: finalise`, that fills a changelog entry's `merged_at`, `commit`, `pr` and `stats` and stamps `version` once release-please has cut a release.
_Avoid_: Enrich, stamp
