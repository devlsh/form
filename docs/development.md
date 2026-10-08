# Development

Use [CONTRIBUTING.md](../CONTRIBUTING.md) for setup, dependency changes, checks, and pull requests. For release or recovery work, read [Releasing](releasing.md).

Before edits, inspect [package.json](../package.json), the affected implementation and tests, and their configuration. Use nearby code patterns and the configured lint and format rules.

## Documentation

When public behavior or scope changes, update affected usage examples and documentation in [README.md](../README.md) and [demo/README.md](../demo/README.md). Update affected agent instructions and routes when contracts or scope change.

## Agent Workflow

Select checks from [CONTRIBUTING](../CONTRIBUTING.md#checks) and [package.json](../package.json) for every affected consumer. Include behavior checks for these cases:

- For form changes, exercise affected registration, defaults, validation errors, submit/loading state, reset, and lifecycle at the public consumer seam.
- For demo changes, use [demo/AGENTS.md](../demo/AGENTS.md) for scoped checks. Library checks do not replace demo checks.

Limit automatic fixes and format changes to the authorized files. Report changed files, check results, and omitted or blocked checks with their reasons.

### Tracker Operations

For tracker work, resolve the exact hosted repository and use [Questions And Reports](../CONTRIBUTING.md#questions-and-reports). Examine current hosted labels before you apply them.
