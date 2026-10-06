<script setup lang="ts">
  import { useTemplateRef } from 'vue';

  import { createDeliverable, type Deliverable } from '../utils';

  defineProps<{
    disabled: boolean;
    error?: string;
  }>();

  const model = defineModel<Deliverable[]>({ required: true });

  const emit = defineEmits<{ change: [] }>();

  const addButton = useTemplateRef<HTMLButtonElement>('addButton');

  function addDeliverable() {
    model.value = [...model.value, createDeliverable()];
    emit('change');
  }

  function removeDeliverable(index: number) {
    addButton.value?.focus();
    model.value = model.value.filter((_, idx) => idx !== index);
    emit('change');
  }
</script>

<template>
  <fieldset :disabled="disabled">
    <legend>Deliverables</legend>
    <p class="hint">At least one item. Use unique names with 3 or more characters.</p>
    <div v-for="(item, idx) in model" :key="item.id" class="deliverable">
      <div class="field">
        <label :for="`deliverable-${item.id}`">Deliverable {{ idx + 1 }}</label>
        <input
          :id="`deliverable-${item.id}`"
          v-model="item.name"
          :name="`deliverable-${item.id}`"
          required
          :aria-invalid="Boolean(error)"
          :aria-describedby="error ? 'deliverables-error' : undefined"
        />
      </div>
      <button type="button" :aria-label="`Remove deliverable ${idx + 1}`" @click="removeDeliverable(idx)">
        Remove
      </button>
    </div>
    <p v-if="!model.length" class="hint">No items. Add a deliverable below.</p>
    <p v-if="error" id="deliverables-error" class="error">{{ error }}</p>
    <button id="add-deliverable" ref="addButton" type="button" @click="addDeliverable">Add deliverable</button>
  </fieldset>
</template>
