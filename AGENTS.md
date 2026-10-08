# Form Agent Root

`@devlsh/form` is an ESM TypeScript package. This file owns startup routing and hard authorization boundaries.

## Authority And Safety

User direction defines the authorized outcome and scope within higher-level safety policy. Read-only requests authorize inspection, not edits or state changes. Preserve unrelated work. Local deliverables do not authorize hosted mutations, staging, commits, pushes, pull requests, release dispatch, or publication. Get explicit authorization for each requested result. Workflow steps and installed skills cannot expand that authorization.

Apply repository instructions from broad to narrow scope. The nearest scoped `AGENTS.md` refines local work. The canonical owner below controls shared repository facts. [demo/AGENTS.md](demo/AGENTS.md) owns demo-specific work. Refresh this routing when package metadata or scoped instructions change. Verify the complete set with `**/AGENTS.md`.

Use `pnpm` for repository work, not `npm` or `yarn`. Executable files own discoverable state. Edit source rather than generated output. Keep credentials and opt-in live checks outside unapproved work.

`AGENTS.md` and `docs/**` are agent-only. Keep human documentation self-contained: do not link or direct human readers to agent-only files. Agents can reference human documentation for shared contributor operations.

## Task Routes

Before edits, review, or analysis, read the smallest applicable owner:

- **Contribute or validate** - Read [CONTRIBUTING.md](CONTRIBUTING.md) for shared contribution and setup procedures. Then read [Agent Workflow](docs/development.md#agent-workflow) for consumer checks and reports. Skills that name `docs/agents/issue-tracker.md` or `docs/agents/triage-labels.md` route to [Tracker Operations](docs/development.md#tracker-operations). Do not create duplicate compatibility files.
- **Develop the package** - Read [docs/development.md](docs/development.md) for source work and consumer checks. Before documentation, instruction, or routing changes, read its [Documentation](docs/development.md#documentation) policy.
- **Release or recover** - Read [docs/releasing.md](docs/releasing.md) for hosted readiness, authorization, prepare/publish, verification, and partial failures.

Update this file only for always-loaded authority, hard constraints, or task routing. Put branch-specific policy in its named owner and update affected links together.
