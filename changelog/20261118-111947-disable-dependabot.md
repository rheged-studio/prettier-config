---
title: Remove the Dependabot configuration
release_note: ""
created_at: "2026-11-18T11:19:47Z"
merged_at: "2026-11-18T11:52:50Z"
branch: disable-dependabot
pr: 5
commit: fb63809
author: rob@rheged.studio
co_authors: []
category: chore
breaking: false
issues: []
affected_packages: []
stats:
  files_changed: 2
  loc_added: 25
  loc_removed: 36
  commits:
---

## Changed

- Removed `.github/dependabot.yml`: Dependabot is switched off across the estate, so this repo no longer
  receives automated dependency or GitHub Actions bump PRs.
