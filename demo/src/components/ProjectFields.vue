<script setup lang="ts">
  import FieldControl from './FieldControl.vue';
  import { type Project } from '../utils';

  defineProps<{ error?: string }>();

  const model = defineModel<Project>({ required: true });
</script>

<template>
  <FieldControl
    id="project-title"
    v-model="model.title"
    label="Project name"
    required
    :error-id="error ? 'project-error' : undefined"
  />
  <FieldControl
    id="project-description"
    v-model="model.description"
    label="Description"
    multiline
    required
    hint="At least 20 characters."
    :error-id="error ? 'project-error' : undefined"
  />
  <p v-if="error" id="project-error" class="error">{{ error }}</p>
</template>
