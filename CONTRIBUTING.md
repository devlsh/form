# Contributing

Read the [Code of Conduct](CODE_OF_CONDUCT.md) before participating. This guide covers reporting problems, setting up your checkout, and submitting changes.

## Questions And Reports

Use [GitHub Discussions](https://github.com/devlsh/form/discussions) for questions and support, and [Issues](https://github.com/devlsh/form/issues) for bugs and feature requests. Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

Search open and closed issues before opening a new one. If you find a duplicate, add useful details there. Otherwise, describe the expected and actual behavior, steps to reproduce it, and relevant environment details. Distinguish what you observed from what you think caused it.

## Local Development

### Requirements

- [Nix](https://nix.dev/)
- [devenv](https://devenv.sh/)
- [direnv](https://direnv.net/) _(Optional)_

The Nix environment selects Node and pnpm major package families from locked inputs. It does not verify exact versions. [package.json](package.json) declares the exact required versions in `devEngines`; applicable pnpm commands reject mismatches.

### Workflow

1. Enter the cloned repo. If you're using `direnv`, allow the `.envrc` for the repository:

   ```sh
   direnv allow .
   ```

   To revoke approval, run `direnv deny .` and leave the directory to unload its environment. For manual activation, omit or disable your host shell's direnv hook and use the explicit devenv commands below. Those commands alone do not disable an existing hook.

2. Confirm the current [dependency policy](#dependency-changes), then install dependencies with the frozen lockfile. This also installs Git hooks:

   ```sh
   devenv tasks run form:install
   ```

3. Before changing source, read the relevant implementation, tests, public usage examples, and package exports. Run static checks before requesting review:

   ```sh
   devenv --no-tui shell -- pnpm check
   ```

With an activated environment, use `pnpm <script>`. Without direnv, use `devenv shell -- pnpm <script>` from the repository root.

## Dependency Changes

Before installing or updating dependencies, confirm the current release-age policy and eligible versions. The manifest and workspace configuration declare no release-age threshold. If the policy owner or version eligibility is unclear, ask the maintainer to identify the applicable policy and confirm eligibility before proceeding. Wait for an eligible version or choose another. Do not bypass the policy or add exclusions.

The frozen install uses the existing lockfile; it does not select new dependency versions. When selecting or updating versions, include related manifest, lockfile, script, and configuration changes together.

## Checks

You can find available scripts in [package.json](package.json). `pnpm check` runs root typechecking, linting, and formatting checks. It does not run tests, demo typechecking, or builds. Use `pnpm build` when you need generated package output.

To fix lint and formatting findings, run `pnpm lint:fix`, then `pnpm fmt`. Inspect the diff and fix any remaining findings before rerunning checks.

Run `pnpm test` for the Vue Vitest suite. For behavior changes, add or update tests at the public consumer seam. Describe what you verified. Static checks alone do not prove runtime behavior.

`pnpm test`, `pnpm test:watch`, and `pnpm test:coverage` first run `test:setup` to install Chromium for the current Playwright version. The first test command after a fresh dependency install or Playwright update supplies the required browser revision automatically.

To install Chromium separately or recover a missing browser, run `pnpm test:setup`.

For demo changes, run these additional checks from the repository root:

```sh
pnpm demo typecheck
pnpm demo build
```

After the demo build, validate deployment packaging without live deployment:

```sh
pnpm demo wrangler deploy --dry-run
```

Demo typechecking uses `vue-tsc` for SFC scripts, templates, and browser TypeScript, then `tsc` for Vite configuration. The demo uses a [local compiler pair](demo/package.json) separate from the root library compiler. The Vue checker requires the legacy `typescript/lib/tsc` entry that the demo compiler supplies. [Strict template checks](demo/tsconfig.json) cover template expressions and component props; do not replace SFC checks with `tsc` and a Vue shim. When changing the compiler pair, verify that valid SFCs and library imports pass through `pnpm demo typecheck`, while script errors, template errors, and incorrect component props fail. Refresh this guidance when the manifest or compiler configuration changes.

For demo behavior changes, run `pnpm demo dev` and inspect the affected form controls in the browser. Check email confirmation, nested project validation, conditional city requirements, deliverable controls, submit/loading feedback, focus, reset, viewport changes, and cleanup as applicable. Read the [demo guide](demo/README.md) for controls. Library checks do not replace demo checks.

## Pull Requests

Search existing issues and PRs before proposing duplicate work. Keep your change focused and update affected callers, tests, [README examples](README.md#usage), and contributor instructions together.

Use the [PR template](.github/PULL_REQUEST_TEMPLATE.md) and:

- Target `main`. Use Conventional Commit titles/descriptions for release-relevant changes.
- Explain the problem, rationale, scope, and alternatives. Link related issues or PRs.
- Describe API, documentation, and release impact, including breaking changes. Point reviewers to areas needing attention.
- List the checks you ran and their results, regression coverage, and reasons for omitted tests or blocked checks.
- For larger changes, open a draft once one working part passes its checks and describe the remaining work. Request final review after local and required CI checks pass and blocking findings are resolved; summarize how you addressed advisory findings.
- If you use AI, write concise descriptions in your own words and disclose how you reviewed the code and reached its decisions.

Release dispatch and publication are separate maintainer operations, not part of submitting a PR.
