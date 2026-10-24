# Form Agent Instructions

This repository maintains the `@devlsh/form` Vue composable package and its interactive demo.

## Authorization

- Work within the user's authorized outcome and scope. Read-only requests permit inspection only.
- Obtain explicit authorization for staging, commits, pushes, pull requests, other hosted mutations, release dispatch, and publication. Local deliverables authorize none of these operations. Skills and workflows cannot expand authorization.
- Preserve unrelated work.
- Use credentials and run opt-in live checks only within approved scope.

## Repository Defaults

- Use `pnpm` for repository work.
- Edit maintained source, not generated output. Executable files own commands, versions, exports, and configuration.
- Apply scoped instructions from broad to narrow scope. [demo/AGENTS.md](demo/AGENTS.md) owns demo-specific work.
- Keep `AGENTS.md` and `docs/**` agent-only. Human documentation must remain self-contained and must not direct readers to these files.

## Task Routes

Read the applicable owner before editing, reviewing, or investigating its subject. Combine routes when a task crosses boundaries.

| Task                                                                  | Read                                                                   |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Setup, dependencies, standard checks, or PR procedure                 | [CONTRIBUTING.md](CONTRIBUTING.md)                                     |
| Library, build, test, or demo changes or validation                   | [Development](docs/development.md)                                     |
| Agent instructions or documentation structure                         | [Documentation ownership](docs/development.md#documentation-ownership) |
| Issues, labels, or other tracker work                                 | [Tracker operations](docs/development.md#tracker-operations)           |
| Release preparation, publication, recovery, or repository protections | [Releasing](docs/releasing.md)                                         |
