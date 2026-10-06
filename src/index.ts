import Validator, { type RuleItem, type ValidateError } from 'async-validator';
import { computed, onBeforeUnmount, reactive, ref, watch, type Ref } from 'vue';

import { type DefaultFields, type Field, type FieldOptions, type FieldValues, type Options } from './types';
import { blankIfUnset } from './utils';

export function useForm<Fields extends DefaultFields>(options: Options<Fields>) {
  type Keys = keyof Fields;

  type FieldStore = { [K in Keys]: Fields[K] | '' };

  // SAFETY: Vue's deep ref unwrapping cannot retain this generic indexed type.
  const fields = ref<Partial<FieldStore>>({}) as Ref<Partial<FieldStore>>;
  const errors = ref<Partial<Record<PropertyKey, ValidateError[]>>>({});

  const validators = ref<Record<PropertyKey, RuleItem>>({});
  let validator = new Validator({});

  const loading = ref(false);

  // The deep watcher includes nested reactive rules. Vue batches its updates.
  const watcher = watch(
    validators,
    (config) => {
      validator = new Validator(config);
    },
    { deep: true },
  );

  Object.assign(fields.value, options.defaults);

  const validate = async (): Promise<boolean> => {
    const validationErrors: ValidateError[] = [];

    try {
      // Collect typed callback errors and consume the promise rejection.
      await validator.validate(fields.value, (errs) => {
        if (errs) {
          validationErrors.push(...errs);
        }
      });

      return true;
    } catch (error) {
      if (validationErrors.length === 0) {
        throw error instanceof Error ? error : new Error('Validation failed', { cause: error });
      }

      for (const failure of validationErrors) {
        if (failure.field) {
          // A nested path can differ from every declared top-level field key.
          (errors.value[failure.field] ??= []).push(failure);
        }
      }

      return false;
    }
  };

  const useField = <K extends Keys>(name: K, fieldOptions: FieldOptions = {}) => {
    errors.value[name] ??= [];

    validators.value[name] = fieldOptions;

    fields.value[name] = blankIfUnset(fields.value[name]);

    const value = computed<Fields[K]>({
      get() {
        // SAFETY: Registration removes undefined, but can leave '' outside Fields[K].
        return fields.value[name] as Fields[K];
      },
      set(val) {
        fields.value[name] = val;
      },
    });

    const fieldErrors = computed<ValidateError[]>(() => errors.value[name] ?? []);

    const fieldError = computed<ValidateError | null>(() => fieldErrors.value[0] ?? null);

    const setError = (text: string) => {
      errors.value[name] = [
        {
          field: String(name),
          message: text,
        },
      ];
    };

    const clearError = () => {
      errors.value[name] = [];
    };

    return reactive({
      /**
       * Errors at this field's exact key.
       */
      errors: fieldErrors,

      /**
       * First field error, or null when none exist.
       */
      error: fieldError,

      /**
       * Whether the field has a stored error.
       */
      hasError: computed(() => fieldError.value !== null),

      /**
       * Replaces the field's errors with one manual error.
       *
       * @param text - Error message to display.
       */
      setError,

      /**
       * Clears errors at this field's exact key.
       */
      clearError,

      /**
       * Shared field value; unset values become `''`.
       */
      value,
    } satisfies Field<Fields[K]>);
  };

  const handle = (run: (values: FieldValues<Fields>) => Promise<void>) => async (e?: Event) => {
    e?.preventDefault();

    if (loading.value) {
      return;
    }

    loading.value = true;

    try {
      clearErrors();

      const valid = await validate();

      if (valid) {
        // SAFETY: Preserve the callback type despite a possibly incomplete store containing ''.
        await run(fields.value as FieldValues<Fields>);
      }
    } finally {
      loading.value = false;
    }
  };

  const clearErrors = () => {
    for (const key of Reflect.ownKeys(errors.value)) {
      errors.value[key] = [];
    }
  };

  const reset = () => {
    // SAFETY: Defaults and field registration supply the declared keys lost by reflection.
    const keys = Reflect.ownKeys(fields.value) as Keys[];

    for (const key of keys) {
      const value = options.defaults?.[key];
      fields.value[key] = blankIfUnset(value);
      errors.value[key] = [];
    }

    loading.value = false;
  };

  const destroy = () => {
    watcher();
  };

  onBeforeUnmount(() => destroy());

  return {
    /**
     * Registers a field with reactive value and error controls.
     *
     * @param name - Field key to register.
     * @param fieldOptions - Validation rule; specify `type` for non-string values.
     */
    useField,

    /**
     * Creates a submit handler that validates before running the callback.
     *
     * @param run - Callback receiving the live form values after successful validation.
     */
    handle,

    /**
     * Restores stored fields to their defaults or `''` and clears their errors.
     */
    reset,

    /**
     * Validates current values; call `clearErrors` first for a fresh error list.
     */
    validate,

    /**
     * Clears all stored errors, including nested validation errors.
     */
    clearErrors,

    /**
     * Tracks submission through `handle`, not direct validation.
     */
    loading,

    /**
     * Stops watching rules; call manually when used outside component setup.
     */
    destroy,
  };
}

export type * from './types';
