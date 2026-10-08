# Contributing

Read the [Code of Conduct](CODE_OF_CONDUCT.md) before you contribute.

## Questions And Reports

Use [GitHub Discussions](https://github.com/devlsh/form/discussions) for questions and support, and [Issues](https://github.com/devlsh/form/issues) for bugs and feature requests. Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

Search open and closed issues first. Add details to a previous report, or open a new one. Include reproduction steps, expected and actual behavior, and environment details.

## Local Development

Install [Nix](https://nix.dev/) and [devenv](https://devenv.sh/), then clone the repository.

From the repository root, install dependencies with the frozen lockfile and install Git hooks:

```sh
devenv tasks run form:install
```

Enter the development shell before you run the pnpm commands below:

```sh
devenv shell
```

If you use [direnv](https://direnv.net/), run `direnv allow .` instead of the manual shell command.

## Dependency Changes

Get maintainer approval for dependency versions before you add or update them. Include the manifest, lockfile, and related script or configuration changes in the same PR.

## Checks

Run the root typecheck, lint, and format checks:

```sh
pnpm check
```

This command does not run tests, demo typechecks, or builds. [package.json](package.json) lists available scripts. Use `pnpm build` when you need generated package output.

Apply automatic fixes only to the files in your change:

```sh
pnpm lint:fix <changed-source-files>
pnpm fmt <changed-files>
```

Inspect the diff, correct remaining findings, and rerun `pnpm check` until it passes. For documentation changes, examine local links and anchors too.

For behavior changes, add or update tests at the public consumer seam. Run `pnpm test` for the Vue Vitest suite, or `pnpm test:coverage` for library coverage. Static checks alone do not prove runtime behavior.

The test commands first run `test:setup` to install Chromium for the current Playwright version. Use `pnpm test:setup` to install Chromium separately or recover a missing browser.

For demo changes, run these checks from the repository root:

```sh
pnpm demo typecheck
pnpm demo build
```

After the demo build, validate deployment packaging without live deployment:

```sh
pnpm demo wrangler deploy --dry-run
```

For demo behavior changes, run `pnpm demo dev` and examine affected controls in the browser. Use the [demo guide](demo/README.md) for the expected behavior. Library checks do not replace demo checks.

## Pull Requests

Search previous issues and PRs first. Keep changes focused, and update affected callers, tests, [usage examples](README.md#usage), and contributor instructions.

- Open a PR against `main` with the [PR template](.github/PULL_REQUEST_TEMPLATE.md). Use a Conventional Commit title for release-relevant changes.
- Explain the change and link related issues. Identify breaking changes and areas that need review.
- List checks run and their results. Explain omitted tests or blocked checks.
- Use a draft for unfinished work. Request final review after local and required CI checks pass and you resolve blocking findings.
- If you use AI, write the description in your own words. Explain how you reviewed its code and decisions.

Release dispatch and publication are separate maintainer operations, outside the PR submission process.
