import { expectTypeOf } from 'vitest';
import { useForm, type FieldValues, type Options } from '../src/index';

interface Fields {
  name: string;
  count: number;
  enabled: boolean;
  nullable: string | null;
  profile: { city: string };
  tags: string[];
}

function inferredForm() {
  const { useField, handle } = useForm({
    defaults: {
      name: 'Ada',
      count: 0,
      enabled: false,
    },
  });

  return {
    useField,
    handle,
    name: useField('name'),
    count: useField('count'),
    enabled: useField('enabled'),
  };
}

function namedForm() {
  const { useField } = useForm<Fields>({});

  return {
    name: useField('name'),
    count: useField('count'),
    enabled: useField('enabled'),
    nullable: useField('nullable'),
    profile: useField('profile'),
    tags: useField('tags'),
  };
}

describe('Types', () => {
  test('preserves field types', () => {
    type Inferred = ReturnType<typeof inferredForm>;

    type Named = ReturnType<typeof namedForm>;

    type Form = ReturnType<typeof useForm<Fields>>;

    expectTypeOf<Parameters<Inferred['useField']>[0]>().toEqualTypeOf<'name' | 'count' | 'enabled'>();
    expectTypeOf<Parameters<Form['useField']>[0]>().toEqualTypeOf<keyof Fields>();

    expectTypeOf(inferredForm).returns.toHaveProperty('name').toHaveProperty('value').toEqualTypeOf<string>();
    expectTypeOf<Inferred['count']['value']>().toEqualTypeOf<number>();
    expectTypeOf<Inferred['enabled']['value']>().toEqualTypeOf<boolean>();

    expectTypeOf(namedForm).returns.toHaveProperty('name').toHaveProperty('value').toEqualTypeOf<string>();
    expectTypeOf<Named['count']['value']>().toEqualTypeOf<number>();
    expectTypeOf<Named['enabled']['value']>().toEqualTypeOf<boolean>();
    expectTypeOf<Named['nullable']['value']>().toEqualTypeOf<string | null>();
    expectTypeOf<Named['profile']['value']>().toEqualTypeOf<{ city: string }>();
    expectTypeOf<Named['tags']['value']>().toEqualTypeOf<string[]>();

    expectTypeOf<Parameters<Parameters<Form['handle']>[0]>[0]>().toEqualTypeOf<FieldValues<Fields>>();
    expectTypeOf<Parameters<Parameters<Inferred['handle']>[0]>[0]>().toEqualTypeOf<{
      name: string;
      count: number;
      enabled: boolean;
    }>();

    expectTypeOf<Options<Fields>['defaults']>().toEqualTypeOf<Partial<FieldValues<Fields>> | undefined>();
    expectTypeOf<keyof Options<Fields>>().toEqualTypeOf<'defaults'>();
  });
});
