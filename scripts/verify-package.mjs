import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const toolchain = spawnSync('pnpm', ['--version'], { encoding: 'utf8' });
if (toolchain.error) throw toolchain.error;
assert.equal(toolchain.status, 0);
assert.equal(toolchain.stdout.trim(), '8.15.9', 'Run via pnpm dlx --package=pnpm@8.15.9 pnpm test:package');
const scratch = await mkdtemp('/private/var/folders/j0/z47723n9415_rggx8q_4rnww0000gn/T/opencode/form-consumer-');
const baseline = process.argv.includes('--baseline');
const name = baseline ? '@evilkiwi/form' : '@devlsh/form';
function run(command, args, cwd = scratch) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `${command} ${args.join(' ')} failed`);
}
function pnpm(args, cwd) {
  run('pnpm', args, cwd);
}
const suppliedTarball = process.argv.find(arg => arg.startsWith('--tarball='))?.slice('--tarball='.length);
if (!suppliedTarball) pnpm(['pack', '--pack-destination', scratch], root);
const tarball =
  suppliedTarball ??
  join(
    scratch,
    (await readdir(scratch)).find(file => file.endsWith('.tgz')),
  );
const packed = spawnSync('tar', ['-xOf', tarball, 'package/package.json'], { encoding: 'utf8' });
assert.equal(packed.status, 0);
const manifest = JSON.parse(packed.stdout);
assert.equal(manifest.name, name, 'packed identity');
assert.equal(manifest.version, '1.1.0');
assert.equal(manifest.license, 'GPL-3.0-only');
assert.equal(manifest.author.name, 'Evil Kiwi Limited');
if (!baseline) {
  assert.equal(manifest.peerDependencies.vue, '^3.3.8');
  assert.equal(manifest.devDependencies.vue, '^3.3.8');
  assert.equal(manifest.dependencies['async-validator'], '^4.2.5');
  assert.equal(manifest.devDependencies['async-validator'], undefined);
  assert.equal(manifest.homepage, 'https://github.com/devlsh/form');
  assert.equal(manifest.bugs.url, 'https://github.com/devlsh/form/issues');
  assert.equal(manifest.repository.url, 'git+https://github.com/devlsh/form.git');
}
await writeFile(
  join(scratch, 'package.json'),
  JSON.stringify({
    private: true,
    type: 'module',
    dependencies: {
      [name]: `file:${tarball}`,
      vue: '3.3.8',
      typescript: '5.2.2',
      esbuild: '0.18.20',
      ...(baseline ? { 'async-validator': '4.2.5' } : {}),
    },
  }),
);
pnpm(['install', '--ignore-scripts'], scratch);
const require = createRequire(join(scratch, 'package.json'));
const installed = dirname(require.resolve(`${name}/package.json`));
assert.deepEqual(await readFile(join(installed, 'LICENSE')), await readFile(join(root, 'LICENSE')));
const cjs = require(name);
const esm = await import(pathToFileURL(join(installed, manifest.module)));
assert.equal(typeof cjs.useForm, 'function');
assert.equal(typeof esm.useForm, 'function');
assert.deepEqual(Object.keys(cjs).sort(), Object.keys(esm).sort());
await writeFile(
  join(scratch, 'types.ts'),
  `import { useForm, type FieldOptions, type Field } from '${name}';
import type { Ref, WritableComputedRef } from 'vue';
const rule: FieldOptions = { required: true, type: 'email' };
const form = useForm<{ email: string }>({ defaults: { email: 'hello@example.com' } });
const field = form.useField('email', rule);
const loading: Ref<boolean> = form.loading;
const error: Field<string>['error']['value'] = field.error;
const value: WritableComputedRef<string>['value'] = field.value;
const errors: Field<string>['errors']['value'] = field.errors;
const valid: Promise<boolean> = form.validate();
form.handle(async values => { const email: string = values.email; void email; });
form.reset(); form.clearErrors(); form.destroy();
void loading; void error; void value; void errors; void valid;
`,
);
run(process.execPath, [
  require.resolve('typescript/bin/tsc'),
  '--noEmit',
  '--strict',
  '--target',
  'ES2020',
  '--module',
  'NodeNext',
  '--moduleResolution',
  'NodeNext',
  join(scratch, 'types.ts'),
]);
console.log('PASS packed identity, license, native CJS/ESM and complete declaration tree', scratch);

await writeFile(
  join(scratch, 'fixture.mjs'),
  `import { createApp, h, nextTick } from 'vue';
import { useForm } from '${name}/build/index.mjs';
const results = [];
const check = (condition, message) => { if (!condition) throw new Error(message); };
async function test(name, run) { try { await run(); results.push({ name, ok: true }); } catch (error) { results.push({ name, ok: false, error: error.message }); } }
let form, email, zero, disabled, empty, nil, missing;
let submitted;
const app = createApp({ setup() {
  form = useForm({ defaults: { email: 'hello@example.com', zero: 0, disabled: false, empty: '', nil: null, missing: undefined } });
  email = form.useField('email', { type: 'email', required: true });
  zero = form.useField('zero', { type: 'number' }); disabled = form.useField('disabled', { type: 'boolean' }); empty = form.useField('empty'); nil = form.useField('nil', { type: 'any' }); missing = form.useField('missing');
  return () => h('input', { value: email.value, onInput: event => { email.value = event.target.value; } });
} });
app.mount('#app'); await nextTick();
await test('Vue field defaults and DOM reactivity', async () => {
  check(email.value === 'hello@example.com', 'missing default');
  const input = document.querySelector('input'); input.value = 'invalid'; input.dispatchEvent(new Event('input', { bubbles: true }));
  await nextTick(); check(email.value === 'invalid', 'input did not update field');
});
await test('async-validator rejects invalid fields', async () => {
  check(await form.validate() === false, 'invalid field accepted');
  check(email.hasError && email.error.field === 'email' && email.errors.length > 0, 'validation error not exposed');
});
await test('invalid submission does not call handler', async () => {
  await form.handle(async values => { submitted = values.email; })();
  check(submitted === undefined && form.loading.value === false, 'invalid submission called handler or remained loading');
});
await test('manual errors and clearErrors', async () => {
  email.setError('manual'); check(email.error.message === 'manual', 'manual error missing');
  email.clearError(); check(!email.hasError, 'field error not cleared');
  email.setError('manual'); form.clearErrors(); check(email.errors.length === 0, 'form errors not cleared');
});
await test('async submit loading and duplicate guard', async () => {
  email.value = 'valid@example.com'; await nextTick();
  let release; let calls = 0;
  const submit = form.handle(async values => { calls++; submitted = values.email; await new Promise(resolve => { release = resolve; }); });
  const pending = submit();
  for (let i = 0; i < 10 && !release; i++) await Promise.resolve();
  check(form.loading.value && calls === 1 && submitted === 'valid@example.com', 'valid submit did not enter loading handler');
  await submit(); check(calls === 1, 'duplicate submission called handler');
  release(); await pending; check(!form.loading.value, 'loading did not clear');
});
await test('reset restores defaults and clears errors', async () => {
  zero.value = 1; disabled.value = true; empty.value = 'changed'; nil.value = 'changed'; missing.value = 'changed';
  email.setError('manual'); form.reset(); await nextTick();
  check(email.value === 'hello@example.com' && !email.hasError && !form.loading.value, 'reset failed');
  check(zero.value === 0 && disabled.value === false && empty.value === '' && nil.value === null && missing.value === '', 'reset changed falsy or undefined defaults');
  check(document.querySelector('input').value === 'hello@example.com', 'reset did not update DOM');
});
await test('destroy stops validator watcher', async () => {
  form.destroy(); form.useField('email', { pattern: /^never$/ }); await nextTick();
  check(await form.validate() === true, 'destroy did not stop validator replacement');
});
await test('component unmount stops validator watcher', async () => {
  let other, field;
  const node = document.createElement('div'); document.body.append(node);
  const owner = createApp({ setup() {
    other = useForm({ defaults: { email: 'hello@example.com' } }); field = other.useField('email', { type: 'email' });
    return () => h('p', field.value);
  } });
  owner.mount(node); await nextTick(); owner.unmount();
  other.useField('email', { pattern: /^never$/ }); await nextTick();
  check(await other.validate() === true, 'unmount did not stop validator replacement'); node.remove();
});
app.unmount();
await test('reset with omitted optional defaults', async () => {
  let blank, field;
  const node = document.createElement('div'); document.body.append(node);
  const owner = createApp({ setup() {
    blank = useForm({}); field = blank.useField('name'); return () => h('p', field.value);
  } });
  owner.mount(node); await nextTick();
  try { field.value = 'changed'; field.setError('manual'); blank.reset(); check(field.value === '' && !field.hasError && !blank.loading.value, 'reset did not clear value, errors, or loading'); }
  finally { owner.unmount(); node.remove(); }
});
await test('rejected submission clears loading', async () => {
  let failed;
  const node = document.createElement('div'); document.body.append(node);
  const owner = createApp({ setup() { failed = useForm({ defaults: {} }); return () => h('p', 'Submission'); } });
  owner.mount(node); await nextTick();
  try {
    const failure = new Error('handler failed'); let rejected;
    try { await failed.handle(async () => { throw failure; })(); } catch (error) { rejected = error; }
    check(rejected === failure, 'original handler rejection not propagated');
    check(failed.loading.value === false, 'loading remains true after handler rejection');
    let retried = false;
    await failed.handle(async () => { retried = true; })();
    check(retried && failed.loading.value === false, 'submission remains blocked after rejection');
  } finally { owner.unmount(); node.remove(); }
});
document.getElementById('result').textContent = JSON.stringify(results, null, 2);
await fetch('/result', { method: 'POST', body: JSON.stringify(results) });
`,
);
const { build } = require('esbuild');
await build({
  entryPoints: [join(scratch, 'fixture.mjs')],
  outfile: join(scratch, 'fixture.js'),
  bundle: true,
  format: 'esm',
  target: 'es2022',
});
const server = createServer(async (request, response) => {
  if (request.url === '/result' && request.method === 'POST') {
    let body = '';
    for await (const chunk of request) body += chunk;
    const results = JSON.parse(body);
    assert.ok(
      Array.isArray(results) &&
        results.length === 10 &&
        results.every(
          result => typeof result.name === 'string' && typeof result.ok === 'boolean' && (result.ok || typeof result.error === 'string'),
        ),
    );
    await writeFile(join(scratch, 'browser-results.json'), JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results, null, 2));
    response.end('Recorded');
    process.exitCode = results.every(result => result.ok) ? 0 : 1;
    server.close();
  } else if (request.url === '/fixture.js') {
    response.setHeader('Content-Type', 'text/javascript');
    response.end(await readFile(join(scratch, 'fixture.js')));
  } else {
    response.setHeader('Content-Type', 'text/html');
    response.end('<div id="app"></div><pre id="result">Running</pre><script type="module" src="/fixture.js"></script>');
  }
});
server.listen(0, '127.0.0.1', () => console.log(`BROWSER REQUIRED: http://127.0.0.1:${server.address().port}/; evidence: ${scratch}`));
