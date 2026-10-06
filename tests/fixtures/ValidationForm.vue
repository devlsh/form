<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { useForm, type FieldOptions } from '../../src/index';

  const {
    useField,
    validate: validateFields,
    clearErrors,
    destroy,
  } = useForm({
    defaults: {
      email: '',
      name: '',
      profile: { city: '' },
      tags: [''],
    },
  });

  const email = useField('email', {
    required: true,
    type: 'email',
    message: 'Enter a valid email',
  });

  const name = useField('name', {
    required: true,
    message: 'Enter a name',
  });

  const cityRule = reactive<FieldOptions>({
    required: true,
    message: 'Enter a city',
  });

  const profile = useField('profile', {
    type: 'object',
    fields: { city: cityRule },
  });

  const tags = useField('tags', {
    type: 'array',
    defaultField: {
      required: true,
      message: 'Enter a tag',
    },
  });

  const result = ref('Not validated');

  async function validate() {
    result.value = 'Pending';
    result.value = String(await validateFields());
  }

  function requireParis() {
    cityRule.pattern = /^Paris$/u;
    cityRule.message = 'Enter Paris';
  }
</script>

<template>
  <section>
    <label>Email <input v-model="email.value" /></label>
    <label>Name <input v-model="name.value" /></label>
    <label>City <input v-model="profile.value.city" /></label>
    <label>First tag <input v-model="tags.value[0]" /></label>
    <output aria-label="Validation result">{{ result }}</output>
    <output aria-label="Email error">{{ email.error?.message ?? 'No error' }}</output>
    <ul aria-label="Validation messages">
      <li v-for="(error, index) in email.errors" :key="index">{{ error.message }}</li>
    </ul>
    <output aria-label="Email has error">{{ String(email.hasError) }}</output>
    <output aria-label="Name error">{{ name.error?.message ?? 'No error' }}</output>
    <output aria-label="Profile error">{{ profile.error?.message ?? 'No error' }}</output>
    <output aria-label="Tags error">{{ tags.error?.message ?? 'No error' }}</output>
    <button type="button" @click="validate">Validate</button>
    <button type="button" @click="email.setError('Email rejected')">Set email error</button>
    <button type="button" @click="email.setError('Email unavailable')">Replace email error</button>
    <button type="button" @click="name.setError('Name rejected')">Set name error</button>
    <button type="button" @click="email.clearError">Clear email error</button>
    <button type="button" @click="clearErrors">Clear all errors</button>
    <button type="button" @click="requireParis">Require Paris city</button>
    <button type="button" @click="destroy">Destroy</button>
  </section>
</template>
