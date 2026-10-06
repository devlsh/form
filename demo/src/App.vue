<script setup lang="ts">
  import { computed, reactive, ref, watch } from 'vue';

  import { useForm } from '../../src/index';
  import DeliverableEditor from './components/DeliverableEditor.vue';
  import FieldControl from './components/FieldControl.vue';
  import ProjectFields from './components/ProjectFields.vue';
  import {
    createDeliverable,
    delay,
    submissionMessage,
    validateDeliverables,
    validateProject,
    type Deliverable,
    type Project,
  } from './utils';

  const status = ref('');

  const { useField, handle, loading, reset } = useForm({
    defaults: {
      email: '',
      confirmation: '',
      project: {
        title: '',
        description: '',
      },
      delivery: 'remote',
      city: '',
      deliverables: [createDeliverable()],
    },
  });

  const email = useField('email', {
    required: true,
    type: 'email',
    message: 'Enter a valid email address.',
  });

  const confirmation = useField('confirmation', {
    required: true,
    validator: (_, value: string) => value !== '' && value === email.value,
    message: 'The email addresses must match.',
  });

  const project = useField('project', {
    type: 'object',
    validator: (_, value: Project) => validateProject(value),
  });

  const delivery = useField('delivery', {
    type: 'enum',
    enum: ['remote', 'onsite'],
  });

  const isCityRequired = computed(() => delivery.value === 'onsite');

  const city = useField(
    'city',
    reactive({
      required: isCityRequired,
      whitespace: isCityRequired,
      message: 'Enter a city for on-site work.',
    }),
  );

  watch(
    () => delivery.value,
    () => {
      city.clearError();
    },
  );

  const deliverables = useField('deliverables', {
    type: 'array',
    validator: (_, values: Deliverable[]) => validateDeliverables(values),
  });

  const submit = handle(async (values) => {
    await delay(2_000);
    status.value = submissionMessage(values.project, values.deliverables);
  });

  function resetDemo() {
    reset();
    project.value = {
      title: '',
      description: '',
    };
    deliverables.value = [createDeliverable()];
    status.value = '';
  }
</script>

<template>
  <main>
    <form novalidate @submit="submit">
      <fieldset :disabled="loading">
        <legend>Contact</legend>
        <div class="row">
          <FieldControl
            id="email"
            v-model="email.value"
            label="Email"
            type="email"
            autocomplete="email"
            required
            :error="email.error?.message"
          />
          <FieldControl
            id="confirmation"
            v-model="confirmation.value"
            label="Confirm email"
            type="email"
            autocomplete="off"
            required
            :error="confirmation.error?.message"
          />
        </div>
      </fieldset>

      <fieldset :disabled="loading">
        <legend>Project</legend>
        <ProjectFields v-model="project.value" :error="project.error?.message" />
        <div class="row">
          <div class="field">
            <label for="delivery">Working arrangement</label>
            <select id="delivery" v-model="delivery.value" name="delivery" required>
              <option value="remote">Remote</option>
              <option value="onsite">On-site</option>
            </select>
          </div>
          <FieldControl
            id="city"
            v-model="city.value"
            label="City"
            autocomplete="address-level2"
            :required="isCityRequired"
            hint="Required for on-site work."
            :error="city.error?.message"
          />
        </div>
      </fieldset>

      <DeliverableEditor
        v-model="deliverables.value"
        :disabled="loading"
        :error="deliverables.error?.message"
        @change="deliverables.clearError"
      />

      <div class="actions">
        <button type="submit" :disabled="loading">{{ loading ? 'Submitting...' : 'Submit' }}</button>
        <button type="button" :disabled="loading" @click="resetDemo">Reset</button>
      </div>
      <p class="hint">
        <em>(<code>Submit</code> takes 2s to demonstrate the loading state)</em>
      </p>
      <p class="status" role="status">{{ loading ? 'Running...' : status }}</p>
    </form>
  </main>
</template>
