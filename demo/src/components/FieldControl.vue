<script setup lang="ts">
  defineProps<{
    id: string;
    label: string;
    type?: 'text' | 'email';
    autocomplete?: string;
    hint?: string;
    error?: string;
    errorId?: string;
    required?: boolean;
    multiline?: boolean;
  }>();

  const model = defineModel<string>({ required: true });
</script>

<template>
  <div class="field">
    <label :for="id">{{ label }} <span v-if="!required" class="optional">(optional)</span></label>
    <textarea
      v-if="multiline"
      :id="id"
      v-model="model"
      :name="id"
      :required="required"
      :aria-invalid="Boolean(error || errorId)"
      :aria-describedby="`${id}-feedback${errorId ? ` ${errorId}` : ''}`"
      rows="3"
    />
    <input
      v-else
      :id="id"
      v-model="model"
      :name="id"
      :type="type ?? 'text'"
      :autocomplete="autocomplete"
      :required="required"
      :aria-invalid="Boolean(error || errorId)"
      :aria-describedby="`${id}-feedback${errorId ? ` ${errorId}` : ''}`"
    />
    <p :id="`${id}-feedback`" class="field-feedback" :class="{ error }">{{ error || hint }}</p>
  </div>
</template>
