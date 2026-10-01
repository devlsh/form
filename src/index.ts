import Validator, { type RuleItem, type ValidateError } from 'async-validator';
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';

import type { DefaultFields, Field, FieldOptions, FieldValues, Options } from './types';

export function useForm<Fields extends DefaultFields>(options: Options<Fields>) {
  // Assign some helper types on a per-instance basis.
  type Keys = keyof Fields;
  type FieldStore = { [K in Keys]: Fields[K] };
  type ErrorStore = { [K in Keys]: ValidateError[] };

  // Store all current values and errors.
  const fields = ref<Partial<FieldStore>>({});
  const errors = ref<Partial<ErrorStore>>({});

  // Store all of the Field validators config.
  const validators = ref<{ [K in Keys]?: RuleItem }>({});
  let validator = new Validator({});

  // Some helper refernces.
  const loading = ref(false);

  // Re-create the Validator when the config changes.
  const watcher = watch(
    validators,
    config => {
      validator = new Validator(config);
    },
    { deep: true },
  );

  // Assign defaults.
  if (options.defaults) {
    const keys = Object.keys(options.defaults);
    const total = keys.length;

    for (let i = 0; i < total; i++) {
      fields.value[keys[i]] = options.defaults[keys[i]];
    }
  }

  // Validates all of the releveant fields.
  const validate = async (): Promise<boolean> =>
    new Promise(resolve => {
      validator.validate(fields.value, undefined, (errs, fields) => {
        if (errs) {
          const total = errs.length;

          for (let i = 0; i < total; i++) {
            const key = errs[i].field;

            if (key) {
              errors.value[key].push(errs[i]);
            }
          }

          resolve(false);
        }

        resolve(true);
      });
    });

  // Returns the references to a specific Field.
  const useField = <K extends Keys>(name: K, fieldOptions: FieldOptions = {}) => {
    if (!errors.value[name]) {
      errors.value[name] = [];
    }

    // Append the Validator config.
    validators.value[name] = fieldOptions;

    // Assign a value if it didn't have a default.
    if (fields.value[name] === undefined) {
      fields.value[name] = '';
    }

    // Computed property for getting & setting the value of the field.
    const value = computed<Fields[K]>({
      get() {
        return fields.value[name];
      },
      set(val) {
        fields.value[name] = val;
      },
    });

    // Computed property for fetching the current error(s).
    const fieldErrors = computed<ValidateError[]>(() => errors.value[name] ?? []);
    const fieldError = computed<ValidateError | null>(() => {
      return fieldErrors.value.length > 0 ? fieldErrors.value[0] : null;
    });

    // Add some manual juice for custom errors.
    const setError = (text: string) => {
      clearError();
      errors.value[name].push({
        field: name,
        message: text,
      });
    };
    const clearError = () => {
      errors.value[name] = [];
    };

    // Return a reactive object for reactivity, ofc.
    return reactive<Field<Fields[K]>>({
      errors: fieldErrors,
      error: fieldError,
      hasError: computed(() => fieldError.value !== null),
      setError,
      clearError,
      value,
    });
  };

  // Handles form submission.
  const handle = (run: (values: FieldValues<Fields>) => Promise<void>) => async (e?: Event) => {
    if (e) {
      e.preventDefault();
    }

    if (loading.value) {
      return;
    }

    loading.value = true;

    try {
      clearErrors();

      const valid = await validate();

      if (valid) {
        await run(fields.value as FieldValues<Fields>);
      }
    } finally {
      loading.value = false;
    }
  };

  // Clears all Errors.
  const clearErrors = () => {
    const keys = Object.keys(errors.value);
    const total = keys.length;

    for (let i = 0; i < total; i++) {
      errors.value[keys[i]] = [];
    }
  };

  // Resets the Form values to their defaults or blank values.
  const reset = () => {
    const keys = Object.keys(fields.value);
    const total = keys.length;

    for (let i = 0; i < total; i++) {
      const key = keys[i];
      fields.value[key] = typeof options?.defaults?.[key] !== 'undefined' ? options.defaults[key] : '';
      errors.value[key] = [];
    }

    loading.value = false;
  };

  // Handle clean-up.
  const destroy = () => {
    if (watcher) {
      watcher();
    }
  };
  onBeforeUnmount(() => destroy());

  return {
    useField,
    handle,
    reset,
    validate,
    clearErrors,
    loading,
    destroy,
  };
}

export * from './types';
