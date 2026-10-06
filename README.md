<p align="center">
  <h1 align="center">@devlsh/form</h1>
  <p align="center">Lightweight, type-safe forms for Vue.</p>
</p>

<br />

<p align="center">
  <a href="https://www.npmjs.com/package/@devlsh/form" rel="nofollow">
    <img src="https://img.shields.io/npm/dm/%40devlsh%2Fform?style=flat-square" alt="NPM Downloads" />
  </a>
  <a href="https://github.com/devlsh/form/stargazers" rel="nofollow">
    <img src="https://img.shields.io/github/stars/devlsh/form?style=flat-square" alt="GitHub Stars" />
  </a>
  <a href="https://github.com/devlsh/form/actions/workflows/validate.yml" rel="nofollow">
    <img src="https://img.shields.io/github/actions/workflow/status/devlsh/form/validate.yml?style=flat-square" alt="Build Status" />
  </a>
  <a href="https://github.com/devlsh/form/blob/main/LICENSE" rel="nofollow">
    <img src="https://img.shields.io/github/license/devlsh/form?style=flat-square" alt="Software License" />
  </a>
</p>

<br />

- [Interactive demo](https://form.devlsh.com).
- Typed field names and values.
- Reactive field values and validation errors.
- Field validation with `async-validator` rules.
- Async submit callbacks with a `loading` state.
- Default values, form reset, and manual field errors.

<br />

## Installation

```bash
$ npm install @devlsh/form
```

## Usage

Validate an email field before submission.

```vue
<template>
  <form novalidate @submit="submit">
    <label for="email">Email Address</label>
    <input
      id="email"
      name="email"
      type="email"
      autocomplete="email"
      required
      :disabled="loading"
      :aria-invalid="email.hasError"
      :aria-describedby="email.hasError ? 'email-error' : undefined"
      v-model="email.value"
    />

    <p id="email-error" role="alert" v-if="email.hasError">{{ email.error?.message }}</p>

    <button type="submit" :disabled="loading">Submit</button>
  </form>
</template>

<script setup lang="ts">
  import { useForm } from '@devlsh/form';

  interface MyForm {
    email: string;
  }

  const { useField, handle, loading } = useForm<MyForm>({
    defaults: { email: '' },
  });

  const email = useField('email', {
    type: 'email',
    required: true,
  });

  const submit = handle(async (values) => {
    console.log(values.email);
  });
</script>
```

## Contributing

Report bugs through [issues](https://github.com/devlsh/form/issues) or ask questions in [Discussions](https://github.com/devlsh/form/discussions). Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

For local development, pull requests, and other contributions, see the [Contributing Guidelines](CONTRIBUTING.md).

## License

`@devlsh/form` is free and open-source software licensed under the [MIT License](LICENSE).

---

> [devlsh.com](https://devlsh.com) &nbsp;&middot;&nbsp;
> GitHub: [@devlsh](https://github.com/devlsh) &nbsp;&middot;&nbsp;
> X: [@itsdevlsh](https://x.com/itsdevlsh)
