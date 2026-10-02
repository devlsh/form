<div align="center">
  <a href="https://www.npmjs.com/package/@devlsh/form" target="_blank">
    <img src="https://img.shields.io/npm/v/@devlsh/form?style=flat-square" alt="NPM" />
  </a>
  <a href="https://discord.gg/3S6AKZ2GR9" target="_blank">
    <img src="https://img.shields.io/discord/1000565079789535324?color=7289DA&label=discord&logo=discord&logoColor=FFFFFF&style=flat-square" alt="Discord" />
  </a>
  <img src="https://img.shields.io/npm/l/@devlsh/form?style=flat-square" alt="GPL-3.0-only" />
  <h3>Form Handling and Validation Hook for Vue 3</h3>
</div>

`@devlsh/form` provides Vue 3 Hooks for consuming, validating and managing Forms.

Inspired by [vue-hooks-form](https://github.com/beizhedenglong/vue-hooks-form).

- Asynchronous validation via [async-validator](https://github.com/yiminghe/async-validator)
- No forced HTML structure/format
- Error handling
- TypeScript

## Installation

Requires Vue `^3.3.8` in the consuming application. `async-validator` is installed as a runtime dependency:

```bash
yarn add @devlsh/form

# or

npm install @devlsh/form
```

## Usage

A simple example app is provided in the [examples/simple](https://github.com/devlsh/form/tree/master/examples/simple) folder.

```vue
<template>
  <form @submit.prevent="submit">
    <label for="email">Email Address</label>
    <input
      type="email"
      name="email"
      id="email"
      placeholder="Email Address"
      :disabled="loading"
      @focus="email.clearError"
      v-model="email.value"
    />
    <p class="err" v-if="email.error">{{ email.error.message }}</p>
    <label for="email">Password</label>
    <input
      type="password"
      name="password"
      id="password"
      placeholder="Password"
      :disabled="loading"
      @focus="password.clearError"
      v-model="password.value"
    />
    <p class="err" v-if="password.error">{{ password.error.message }}</p>
    <button type="submit" :disabled="loading">Login</button>
  </form>
</template>

<script lang="ts" setup>
import { useForm } from '@devlsh/form';

const { useField, handle, loading } = useForm<{
  email: string;
  password: string;
}>({
  defaults: {
    email: 'hello@example.com',
  },
});

const email = useField('email', {
  type: 'email',
  required: true,
});
const password = useField('password', {
  required: true,
});

const submit = handle(async ({ email, password }) => {
  alert(`Email: ${email} Password: ${password}`);
});
</script>
```

## API

### `useForm`

#### Options

| **Option**     | **Default** | **Type**              | **Description**                                                                          |
| -------------- | ----------- | --------------------- | ---------------------------------------------------------------------------------------- |
| defaults       | `{}`        | `Record<string, any>` | Optionally provide defaults for the various fields in this object by key -> value pairs. |
| validationMode | `submit`    | `'change'\|'submit'`  | NOT IMPLEMENTED YET. Whether to validate input once submitted                            |

#### Response

| **Option**    | **Type**                                                               | **Description**                                                                                   |
| ------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `useField`    | `Field<unknown>`                                                       | [Documented below.](#usefield)                                                                    |
| `handle`      | `(run: values => Promise<void>) => async (e?: Event) => Promise<void>` | Registers the asynchronous handler that runs once a form is submitted and successfully validated. |
| `reset`       | `() => void`                                                           | Reset the Form to tis default state.                                                              |
| `validate`    | `() => Promise<boolean>`                                               | Manually trigger validation and error handling.                                                   |
| `clearErrors` | `() => void`                                                           | Clear all errors for all fields.                                                                  |
| `loading`     | `Ref<boolean>`                                                         | Whether the form is currently executing.                                                          |
| `destroy`     | `() => void`                                                           | Destroy and clean-up the Form handler. Happens automatically during `onBeforeUnmount`.            |

### `useField`

#### Options

Currently the options object provided to `useField` is inheritted from [async-validator](https://github.com/yiminghe/async-validator) and
all options are forwarded as a validation field.

#### Response

| **Option**   | **Type**                       | **Description**                                                    |
| ------------ | ------------------------------ | ------------------------------------------------------------------ |
| `errors`     | `ValidateError[]`              | An array of all Errors set against this Field.                     |
| `error`      | `ValidateError\|null`          | Optimistically picks one, if any, of the Errors against the field. |
| `hasError`   | `ComputedRef<boolean>`         | Whether or not the Field has 1 or more errors.                     |
| `setError`   | `(text: string) => void`       | Manually set the error on this field.                              |
| `clearError` | `() => void`                   | Clears all Errors currently set against this Field.                |
| `value`      | `WritableComputedRef<unknown>` | The value for the field, compatible with `v-model`.                |

## To-do

- Add a test suite
