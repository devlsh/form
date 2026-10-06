# Form Demo

Apply [shared development standards](../docs/development.md) and [agent workflow](../docs/development.md#agent-workflow) to demo work.

## Owners And Scope

- [index.html](index.html) owns the `#app` host. [src/index.ts](src/index.ts) mounts the root [src/App.vue](src/App.vue) and imports [src/style.css](src/style.css).
- [src/App.vue](src/App.vue) owns library field registration, conditional city requirements, local submission, and reset. [src/utils.ts](src/utils.ts) owns demo validators, fresh deliverables, delay, and success text. [src/components/ProjectFields.vue](src/components/ProjectFields.vue) owns nested project inputs. [src/components/DeliverableEditor.vue](src/components/DeliverableEditor.vue) owns row controls and focus recovery before removal. [src/components/FieldControl.vue](src/components/FieldControl.vue) owns shared labeled inputs and textareas with hints and error relationships.
- Preserve a simple, styled form in the center of the screen, with no graphics or decorative interface additions. Designer owns visual direction. Keep the showcase logic in the root SFC. The callback is local with no backend or storage.
- Import the library from `../../src/index` in demo source, not package output. Reuse the root `async-validator` dependency through the library. Do not add PixiJS, lil-gui, or another validator dependency.
- [package.json](package.json), [vite.config.ts](vite.config.ts), and the TypeScript configs own local commands and build configuration. [../pnpm-workspace.yaml](../pnpm-workspace.yaml) and the shared lockfile own workspace installation.
- [wrangler.jsonc](wrangler.jsonc) owns static assets and the production domain. [demo.yml](../.github/workflows/demo.yml) separates credential-free checks from main-only deployment through `production`. Local work does not authorize live deployment or prove hosted readiness.

Refresh these instructions and [README.md](README.md) when these owners change entry files, commands, or interface behavior. Keep browser behavior claims tied to implemented source and actual checks.

## Checks

Use the shared environment and dependency recovery from [agent workflow](../docs/development.md#environment-and-dependencies). From the repository root:

- `pnpm demo typecheck` runs `vue-tsc` for SFC scripts, templates, and browser TypeScript, then `tsc` for Vite configuration. It emits no files and does not use the root Vue shim. Preserve the [demo-local compiler pair](package.json) and strict template checks. For compiler changes, verify valid SFCs pass and invalid scripts, templates, and component props fail through the real command.
- `pnpm demo build` compiles Vue SFCs and builds static assets in `demo/dist`. A successful build does not prove SFC type safety or browser behavior.
- After the build, run `pnpm demo wrangler deploy --dry-run` exactly as shown, without extra environment variables. This native check validates deployment packaging without live deployment.
- `pnpm demo dev` starts Vite for real-interface checks. Check email confirmation, nested project validation, conditional city requirements, and deliverable length and uniqueness. Inspect stable row identity, keyboard recovery after removal, the 2-second callback, disabled controls, reset, viewport changes, and HMR cleanup as affected. Invalid submissions and new rows do not request automatic focus.

Select these checks with [shared validation](../docs/development.md#validation-selection). Library checks do not replace demo checks. Report actual commands, outcomes, and coverage gaps. If a check fails, repair its executable owner or report the blocker. Local checks do not verify DNS, custom-domain ownership, secrets, or hosted environment protection.
