<script setup lang="ts">
  import { ref } from 'vue';
  import { useForm, type FieldOptions, type FieldValues } from '../../src/index';

  interface Props {
    validate?: () => Promise<void>;
    submit?: (values: FieldValues<{ email: string }>) => Promise<void>;
    transform?: (value: string) => string;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    submitted: [values: FieldValues<{ email: string }>];
    completed: [values: FieldValues<{ email: string }>];
  }>();

  const { useField, handle, validate: validateFields, clearErrors, loading } = useForm({ defaults: { email: '' } });

  const rule: FieldOptions = props.validate
    ? { asyncValidator: props.validate }
    : {
        required: true,
        type: 'email',
        message: 'Enter a valid email',
      };

  if (props.transform) {
    rule.transform = props.transform;
  }

  const email = useField('email', rule);

  const result = ref('Not submitted');

  const validated = ref('Not validated');

  const prevented = ref(false);

  const submit = handle(async (values) => {
    emit('submitted', { email: values.email });
    await props.submit?.(values);
    emit('completed', { email: values.email });
    result.value = 'Submitted';
  });

  async function onSubmit(event: Event) {
    const pending = submit(event);
    prevented.value = event.defaultPrevented;

    try {
      await pending;
    } catch (error) {
      result.value = error instanceof Error ? error.message : String(error);
    }
  }

  async function onValidate() {
    validated.value = 'Pending';
    validated.value = String(await validateFields());
  }
</script>

<template>
  <form novalidate @submit="onSubmit">
    <label>Email <input v-model="email.value" type="email" required /></label>
    <output aria-label="Email error">{{ email.error?.message ?? 'No error' }}</output>
    <output aria-label="Loading">{{ loading ? 'Pending' : 'Ready' }}</output>
    <output aria-label="Submit result">{{ result }}</output>
    <output aria-label="Validation result">{{ validated }}</output>
    <output aria-label="Native submit prevented">{{ String(prevented) }}</output>
    <button type="button" @click="onValidate">Validate</button>
    <button type="button" @click="clearErrors">Clear all errors</button>
    <button type="submit">Submit</button>
  </form>
</template>
