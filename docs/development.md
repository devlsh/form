# Development

## Change Workflow

1. Read [CONTRIBUTING.md](../CONTRIBUTING.md) for setup, dependency approval, standard checks, and PR procedure.
2. Identify each affected consumer using the source map below. Inspect its implementation, tests, configuration, and public usage before editing.
3. Apply the relevant validation requirements below, in addition to the standard checks. Scope automatic fixes and formatting to authorized files.
4. Report changed behavior, checks actually run and their results, and omitted or blocked checks with reasons. Distinguish local evidence from hosted or installed-consumer evidence.

## Source And Consumer Map

| Change                                 | Source and contract to inspect                                                                                                                                                                                           |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Form behavior or public types          | [src/index.ts](../src/index.ts), [src/types.ts](../src/types.ts), [src/utils.ts](../src/utils.ts), [tests](../tests), and [README usage](../README.md#usage)                                                             |
| Build or package contents              | [tsdown.config.ts](../tsdown.config.ts), [tsconfig.build.json](../tsconfig.build.json), and exports/files/lifecycle scripts in [package.json](../package.json)                                                           |
| Browser test setup                     | [vitest.config.ts](../vitest.config.ts), [tests](../tests), [shim.d.ts](../shim.d.ts), and [tsconfig.json](../tsconfig.json)                                                                                             |
| Demo behavior, compiler, or deployment | [demo/AGENTS.md](../demo/AGENTS.md), [demo/README.md](../demo/README.md), and [demo.yml](../.github/workflows/demo.yml)                                                                                                  |
| Toolchain or workflow                  | [oxlint.config.ts](../oxlint.config.ts), [oxfmt.config.ts](../oxfmt.config.ts), [pnpm-workspace.yaml](../pnpm-workspace.yaml), [lefthook.yml](../lefthook.yml), and callers in [.github/workflows](../.github/workflows) |

- Keep form orchestration in `src/index.ts`, public types in `src/types.ts`, and internal value normalization in `src/utils.ts`. Preserve the single ESM package entry unless the requested contract changes.
- The demo and browser fixtures consume library source. They do not prove installed package exports or declarations.
- The root Vue shim does not check SFC scripts or templates. The demo has its own compiler pair and strict SFC checks; preserve that boundary when changing root TypeScript.
- `dist` and `demo/dist` are generated output. Edit maintained source and configuration.

## Validation Requirements

Select focused checks from [package.json](../package.json) during development. Complete the [standard checks](../CONTRIBUTING.md#checks) before closeout. Add evidence for each affected consumer:

| Affected surface               | Required evidence                                                                                                                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Form behavior                  | Exercise affected registration, defaults, validation errors, submit/loading state, reset, and lifecycle through the browser consumer fixtures. Static checks do not prove runtime behavior. |
| Public types                   | Run both root typechecks and inspect affected consumer inference in [tests/types.test.ts](../tests/types.test.ts).                                                                          |
| Module exports or build output | Build, pack, and install into an isolated consumer. Verify ESM imports, declarations, and an affected form workflow. Source-local checks do not prove the published module layout.          |
| Demo                           | Follow [demo checks](../demo/AGENTS.md#checks), including SFC typechecking, build, and deployment packaging. Library checks do not replace demo checks.                                     |
| Toolchain or workflow          | Check the shared setup action's contract and every caller. GitHub Actions execution remains unverified unless an authorized hosted run covers the change.                                   |

The formatter excludes `.github`, the changelog, generated output, and the lockfile. A passing format check is not evidence for those surfaces. Inspect the effective lint and format configuration when changing shared presets.

## Documentation Ownership

- Keep always-loaded authorization, repository defaults, and task routes in [AGENTS.md](../AGENTS.md). Put branch-specific instructions in their task owner. Verify scoped instruction files with `**/AGENTS.md` when changing routing.
- Keep shared contributor procedures in CONTRIBUTING, demo-specific instructions in [demo/AGENTS.md](../demo/AGENTS.md), and release operations in [Releasing](releasing.md). Link to the owner instead of copying its procedure.
- Keep public behavior and examples in the root README and demo README.
- When instructions change, update affected routes and remove obsolete guidance in the same change. Verify local paths and anchors, and compare documented commands and claims with their executable owners.
- Check incoming links from human documentation against the audience boundary in [AGENTS.md](../AGENTS.md#repository-defaults).

## Tracker Operations

- Resolve the exact hosted repository from [package.json](../package.json) and the requested object before acting.
- Follow [Questions And Reports](../CONTRIBUTING.md#questions-and-reports) for support, issue search, and private security reports.
- Read current hosted labels before applying them. Configuration files and old reports do not establish current hosted state.
- Skills naming `docs/agents/issue-tracker.md` or `docs/agents/triage-labels.md` route here. Keep one tracker owner rather than adding compatibility files.
