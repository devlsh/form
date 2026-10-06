# Releasing

Release stable `devlsh/form` from `main` to npm's `latest`. [release.yml](../.github/workflows/release.yml) owns dispatch, inputs/outputs, permissions, and gates; [release.json](../release.json) owns Release Please's Node strategy/configuration; [.manifest.json](../.manifest.json) tracks releases.

## Authorization And Hosted Readiness

Live GitHub/npm inspection, hosted changes, merges, dispatch, publication, and repair each require applicable explicit authorization. Local edits or ordinary PR requests authorize none of these. Stop on unresolved prerequisites.

Before dispatch:

1. Establish a public repository with accessible corresponding source, Discussions for support, and hosted default branch `main`.
2. Put reviewed workflow/config/manifest changes on `main` through approved maintainer flow. Keep package version, changelog, and manifest consistent. Uncommitted files do not initialize automation. Approved history needs release-relevant commits; automation does not initialize empty history. Versions do not prove publication.
3. Verify direct publish permission and npm trusted publishing for existing `@devlsh/form`, repository `devlsh/form`, GitHub-hosted runners, workflow `release.yml`, and no environment. Trust cannot create absent packages. Publication uses tokenless pnpm OIDC with provenance, without token fallback. Verify hosted trust and provenance acceptance live when authorized.
4. Permit Actions to create release PRs/releases and use `autorelease: pending` and `autorelease: tagged` labels. Before merging, review branch protection, merge policy, required checks, and Actions policy/check path. Workflow GitHub-token PRs do not prove checks will run.

Follow [local setup](../CONTRIBUTING.md#local-development), [validation](development.md#validation-selection), and [closeout](development.md#closeout).

## Hosted Rulesets

[main.json](../.github/rulesets/main.json) and [release-tags.json](../.github/rulesets/release-tags.json) require manual import, not synchronization. When authorized, import through **Settings > Rules > Rulesets**, review, and explicitly activate. Reimport or edit hosted settings after file changes.

Before activation, inspect enforcement, bypass actors, branch/tag restrictions, and review requirements. Read the exact check context/source binding from the main ruleset and [validate.yml](../.github/workflows/validate.yml); verify after import and refresh after job renames. Preserve Release Please tag creation. Confirm hosted enforcement live.

## Prepare And Publish

Manual `workflow_dispatch` permits only `prepare`/`publish` on `main`, rejecting other refs/operations before Release Please runs. Shared concurrency retains running releases but may replace pending runs. Serialization is not a durable queue; inspect outcomes.

1. Dispatch `operation: prepare` on `main`. Release Please creates/refreshes package-version, changelog, and manifest changes in a PR, without a GitHub release. No relevant commits may mean no PR.
2. Review against `main`, including version/changelog; complete [PR validation](development.md#pull-request-operations) and approved maintainer merge. The version change is already in the PR.
3. Dispatch `operation: publish` on `main` after merging the reviewed stable release PR. Release Please creates GitHub releases for merged pending PRs with PR creation disabled. There is no version input or custom candidate selection.
4. Inspect root-package `release_created`, `sha`, `tag_name`, and `version`. npm publication requires `release_created == 'true'` and checks out the new release's immutable `sha`. An existing GitHub release alone does not satisfy this gate.
5. [shared setup](https://github.com/devlsh/tools/blob/5a43d10d4535a7cf1368acd9313e70d417ac6235/github/setup/action.yml) installs frozen dependencies. [release.yml](../.github/workflows/release.yml) runs `pnpm publish --access public --tag latest --provenance --no-git-checks` directly on the runner, retaining OIDC, without staging publication. `--no-git-checks` allows detached checkout. `prepack: pnpm build` builds checked-out source; installation retains `prepare` Lefthook setup. Neither lifecycle receives GitHub API/npm tokens; publication sets no user configuration. Only the publish job receives `id-token: write`.
6. Inspect the complete run; confirm completion from live GitHub release/tag target and npm version/`latest` state. Release Please labels change during GitHub release creation, before npm publication, and do not prove completion. No post-publication registry verification runs. Metadata and provenance configuration do not verify tarball contents.

Offline checks cannot prove runtime behavior, hosted settings, trust readiness, or publication success.

## Partial Failures And Limits

- **GitHub release created, npm failed** - Inspect failed run, merged PR, release/tag target, and npm version/`latest` to decide whether publication or dist-tag repair is needed. Recovery requires an authorized maintainer. Never blindly redispatch: another dispatch must satisfy the release-created gate and is not an automatic recovery procedure. Reruns cannot replace npm inspection after ambiguous failure.
- **Release/registry conflict** - Stop for maintainer investigation. Compare reviewed package/manifest version, immutable source SHA, tag/release, npm version, and provided `gitHead`. Never move release tags to bypass mismatches. Registry metadata does not establish artifact identity.
- **Unsupported automation** - Stable `main`/`latest` only. No custom candidate/version/tag guards, registry preflight, publication retries, completion polling, or npm-completion label reconciliation. Automatic repair/retry is unsupported; maintainers own recovery and explicitly authorized repair.

Refresh when operations, gates, lifecycle, trust, or recovery change. Executable owners retain exact action/core pins.
