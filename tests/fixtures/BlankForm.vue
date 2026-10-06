<script setup lang="ts">
  import { useForm } from '../../src/index';

  const emit = defineEmits<{ submitted: [values: { name: string }] }>();

  const { useField, handle, reset } = useForm<{ name: string }>({});

  const name = useField('name');

  const submit = handle(async (values) => {
    emit('submitted', { name: values.name });
  });
</script>

<template>
  <form @submit="submit">
    <label>Name <input v-model="name.value" /></label>
    <output aria-label="Current name">{{ name.value }}</output>
    <button type="button" @click="reset">Reset</button>
    <button type="submit">Submit</button>
  </form>
</template>
