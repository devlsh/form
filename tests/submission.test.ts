import { render } from 'vitest-browser-vue';
import SubmissionForm from './fixtures/SubmissionForm.vue';

describe('Submission', () => {
  test('blocks invalid submissions', async () => {
    const screen = await render(SubmissionForm);

    await screen
      .getByRole('button', {
        name: 'Submit',
        exact: true,
      })
      .click();

    await expect.element(screen.getByRole('status', { name: 'Native submit prevented' })).toHaveTextContent('true');
    await expect.element(screen.getByRole('status', { name: 'Email error' })).toHaveTextContent('Enter a valid email');
    await expect.element(screen.getByRole('status', { name: 'Loading' })).toHaveTextContent('Ready');
    expect(screen.emitted('submitted')).toBeUndefined();

    await screen.getByLabelText('Email').fill('ada@example.com');
    await screen
      .getByRole('button', {
        name: 'Submit',
        exact: true,
      })
      .click();

    await expect.poll(() => screen.emitted('submitted')).toEqual([[{ email: 'ada@example.com' }]]);
    await expect.element(screen.getByRole('status', { name: 'Email error' })).toHaveTextContent('No error');
    await expect.element(screen.getByRole('status', { name: 'Submit result' })).toHaveTextContent('Submitted');
  });

  test('awaits async validation', async () => {
    let validation = Promise.withResolvers<void>();
    const screen = await render(SubmissionForm, { props: { validate: async () => validation.promise } });

    await screen.getByLabelText('Email').fill('ada@example.com');
    await screen
      .getByRole('button', {
        name: 'Submit',
        exact: true,
      })
      .click();

    await expect.element(screen.getByRole('status', { name: 'Loading' })).toHaveTextContent('Pending');
    expect(screen.emitted('submitted')).toBeUndefined();

    validation.reject(new Error('Email unavailable'));

    await expect.element(screen.getByRole('status', { name: 'Email error' })).toHaveTextContent('Email unavailable');
    await expect.element(screen.getByRole('status', { name: 'Loading' })).toHaveTextContent('Ready');
    expect(screen.emitted('submitted')).toBeUndefined();

    validation = Promise.withResolvers<void>();
    await screen
      .getByRole('button', {
        name: 'Submit',
        exact: true,
      })
      .click();

    await expect.element(screen.getByRole('status', { name: 'Loading' })).toHaveTextContent('Pending');
    expect(screen.emitted('submitted')).toBeUndefined();

    validation.resolve();

    await expect.element(screen.getByRole('status', { name: 'Submit result' })).toHaveTextContent('Submitted');
    await expect.element(screen.getByRole('status', { name: 'Email error' })).toHaveTextContent('No error');
    await expect.poll(() => screen.emitted('submitted')).toEqual([[{ email: 'ada@example.com' }]]);
  });

  test('prevents overlapping submissions', async () => {
    const validation = Promise.withResolvers<void>();
    const completion = Promise.withResolvers<void>();

    const screen = await render(SubmissionForm, {
      props: {
        validate: async () => validation.promise,
        submit: async () => completion.promise,
      },
    });

    await screen.getByLabelText('Email').fill('ada@example.com');
    await screen
      .getByRole('button', {
        name: 'Submit',
        exact: true,
      })
      .click();

    await expect.element(screen.getByRole('status', { name: 'Loading' })).toHaveTextContent('Pending');
    expect(screen.emitted('submitted')).toBeUndefined();

    await screen
      .getByRole('button', {
        name: 'Submit',
        exact: true,
      })
      .click();
    await screen.getByLabelText('Email').fill('current@example.com');
    validation.resolve();

    await expect.poll(() => screen.emitted('submitted')).toEqual([[{ email: 'current@example.com' }]]);

    await screen
      .getByRole('button', {
        name: 'Submit',
        exact: true,
      })
      .click();
    await screen.getByLabelText('Email').fill('live@example.com');
    completion.resolve();

    await expect.element(screen.getByRole('status', { name: 'Submit result' })).toHaveTextContent('Submitted');
    await expect.poll(() => screen.emitted('completed')).toEqual([[{ email: 'live@example.com' }]]);
    await expect.poll(() => screen.emitted('submitted')).toEqual([[{ email: 'current@example.com' }]]);
    await expect.element(screen.getByRole('status', { name: 'Loading' })).toHaveTextContent('Ready');
  });

  test('recovers from callback errors', async () => {
    let fail = true;

    const screen = await render(SubmissionForm, {
      props: {
        submit: async () => {
          if (fail) {
            throw new Error('Save failed');
          }
        },
      },
    });

    await screen.getByLabelText('Email').fill('ada@example.com');
    await screen
      .getByRole('button', {
        name: 'Submit',
        exact: true,
      })
      .click();

    await expect.element(screen.getByRole('status', { name: 'Submit result' })).toHaveTextContent('Save failed');
    await expect.element(screen.getByRole('status', { name: 'Loading' })).toHaveTextContent('Ready');
    await expect.poll(() => screen.emitted('submitted')).toEqual([[{ email: 'ada@example.com' }]]);
    expect(screen.emitted('completed')).toBeUndefined();

    fail = false;
    await screen
      .getByRole('button', {
        name: 'Submit',
        exact: true,
      })
      .click();

    await expect.element(screen.getByRole('status', { name: 'Submit result' })).toHaveTextContent('Submitted');
    await expect.element(screen.getByRole('status', { name: 'Loading' })).toHaveTextContent('Ready');
    await expect
      .poll(() => screen.emitted('submitted'))
      .toEqual([[{ email: 'ada@example.com' }], [{ email: 'ada@example.com' }]]);
    await expect.poll(() => screen.emitted('completed')).toEqual([[{ email: 'ada@example.com' }]]);
  });

  test('recovers from transform errors', async () => {
    let fail = true;

    const screen = await render(SubmissionForm, {
      props: {
        transform: (value: string) => {
          if (fail) {
            throw new Error('Transform failed');
          }

          return value;
        },
      },
    });

    await screen.getByLabelText('Email').fill('ada@example.com');
    await screen
      .getByRole('button', {
        name: 'Submit',
        exact: true,
      })
      .click();

    await expect.element(screen.getByRole('status', { name: 'Submit result' })).toHaveTextContent('Transform failed');
    await expect.element(screen.getByRole('status', { name: 'Loading' })).toHaveTextContent('Ready');
    expect(screen.emitted('submitted')).toBeUndefined();

    fail = false;
    await screen
      .getByRole('button', {
        name: 'Submit',
        exact: true,
      })
      .click();

    await expect.element(screen.getByRole('status', { name: 'Submit result' })).toHaveTextContent('Submitted');
    await expect.poll(() => screen.emitted('submitted')).toEqual([[{ email: 'ada@example.com' }]]);
  });
});
