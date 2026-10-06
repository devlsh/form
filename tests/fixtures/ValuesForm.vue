<script setup lang="ts">
  import { useForm, type FieldValues } from '../../src/index';

  interface Fields {
    name: string;
    count: number;
    enabled: boolean;
    nullable: string | null;
    unset: string;
    blank: string;
    profile: { city: string };
    tags: string[];
  }

  const emit = defineEmits<{ submitted: [values: FieldValues<Fields>] }>();

  const { useField, handle, reset } = useForm<Fields>({
    defaults: {
      name: 'Ada',
      count: 0,
      enabled: false,
      nullable: null,
      unset: undefined,
      profile: { city: 'London' },
      tags: ['reader'],
    },
  });

  const name = useField('name');

  const count = useField('count', { type: 'number' });

  const enabled = useField('enabled', { type: 'boolean' });

  const nullable = useField('nullable');

  const unset = useField('unset');

  const blank = useField('blank');

  const profile = useField('profile', { type: 'object' });

  const tags = useField('tags', { type: 'array' });

  const submit = handle(async (values) => {
    emit('submitted', {
      name: values.name,
      count: values.count,
      enabled: values.enabled,
      nullable: values.nullable,
      unset: values.unset,
      profile: { city: values.profile.city },
      tags: [...values.tags],
      blank: values.blank,
    });
  });
</script>

<template>
  <form @submit="submit">
    <label>Name <input v-model="name.value" /></label>
    <label>Count <input v-model.number="count.value" /></label>
    <label>Enabled <input v-model="enabled.value" type="checkbox" /></label>
    <label>Nullable <input v-model="nullable.value" /></label>
    <label>Unset <input v-model="unset.value" /></label>
    <label>No default <input v-model="blank.value" /></label>
    <label>City <input v-model="profile.value.city" /></label>
    <label>First tag <input v-model="tags.value[0]" /></label>
    <output aria-label="Current name">{{ name.value }}</output>
    <output aria-label="Current count">{{ typeof count.value }}: {{ count.value }}</output>
    <output aria-label="Current enabled">{{ String(enabled.value) }}</output>
    <output aria-label="Current nullable">{{ nullable.value === null ? 'null' : nullable.value }}</output>
    <output aria-label="Current unset">{{ unset.value }}</output>
    <output aria-label="Current city">{{ profile.value.city }}</output>
    <ul aria-label="Current tags">
      <li v-for="(tag, index) in tags.value" :key="index">{{ tag }}</li>
    </ul>
    <output aria-label="Current blank">{{ blank.value }}</output>
    <output aria-label="Name error">{{ name.error?.message ?? 'No error' }}</output>
    <button type="button" @click="name.setError('Name rejected')">Set name error</button>
    <button type="button" @click="reset">Reset</button>
    <button type="submit">Submit</button>
  </form>
</template>
