import { type RuleItem, type ValidateError } from 'async-validator';
import { type ComputedRef, type WritableComputedRef } from 'vue';

export type DefaultFields = object;

/**
 * Initial values and reset defaults for `useForm`.
 */
export interface Options<Fields extends DefaultFields> {
  /**
   * Values used at initialization and reset without cloning.
   */
  defaults?: Partial<FieldValues<Fields>>;
}

/**
 * An async-validator rule; reactive rules support later changes.
 */
export type FieldOptions = RuleItem;

/**
 * Declared values for defaults and submit callbacks.
 */
export type FieldValues<Fields extends DefaultFields> = {
  [K in keyof Fields]: Fields[K];
};

/**
 * Field controls before `useField` unwraps their refs.
 */
export interface Field<T> {
  /**
   * Errors at this field's exact key.
   */
  errors: ComputedRef<ValidateError[]>;

  /**
   * First field error, or null when none exist.
   */
  error: ComputedRef<ValidateError | null>;

  /**
   * Whether the field has a stored error.
   */
  hasError: ComputedRef<boolean>;

  /**
   * Replaces the field's errors with one manual error.
   *
   * @param text - Error message to display.
   */
  setError: (text: string) => void;

  /**
   * Clears errors at this field's exact key.
   */
  clearError: () => void;

  /**
   * Shared field value; unset values become `''`.
   */
  value: WritableComputedRef<T>;
}
