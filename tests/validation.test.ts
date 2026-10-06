import { render } from 'vitest-browser-vue';
import ValidationForm from './fixtures/ValidationForm.vue';
import SubmissionForm from './fixtures/SubmissionForm.vue';

describe('Validation', () => {
  test('validates required and email fields', async () => {
    const screen = await render(ValidationForm);

    await screen.getByLabelText('City').fill('London');
    await screen.getByLabelText('First tag').fill('reader');
    await screen
      .getByRole('button', {
        name: 'Validate',
        exact: true,
      })
      .click();

    await expect.element(screen.getByRole('status', { name: 'Validation result' })).toHaveTextContent('false');
    await expect.element(screen.getByRole('status', { name: 'Name error' })).toHaveTextContent('Enter a name');
    await expect.element(screen.getByRole('status', { name: 'Email error' })).toHaveTextContent('Enter a valid email');

    await screen.getByLabelText('Name').fill('Ada');
    await screen.getByLabelText('Email').fill('not-an-email');
    await screen.getByRole('button', { name: 'Clear all errors' }).click();
    await screen
      .getByRole('button', {
        name: 'Validate',
        exact: true,
      })
      .click();

    await expect.element(screen.getByRole('status', { name: 'Email has error' })).toHaveTextContent('true');

    await screen.getByLabelText('Email').fill('ada@example.com');
    await screen
      .getByRole('button', {
        name: 'Validate',
        exact: true,
      })
      .click();

    await expect.element(screen.getByRole('status', { name: 'Validation result' })).toHaveTextContent('true');
    await expect.element(screen.getByRole('status', { name: 'Email error' })).toHaveTextContent('Enter a valid email');
  });

  test('validates nested fields', async () => {
    const screen = await render(ValidationForm);

    await screen.getByLabelText('Email').fill('ada@example.com');
    await screen.getByLabelText('Name').fill('Ada');
    await screen.getByLabelText('First tag').fill('reader');
    await screen
      .getByRole('button', {
        name: 'Validate',
        exact: true,
      })
      .click();

    await expect.element(screen.getByRole('status', { name: 'Validation result' })).toHaveTextContent('false');
    await expect.element(screen.getByRole('status', { name: 'Profile error' })).toHaveTextContent('No error');
    await expect.element(screen.getByRole('status', { name: 'Tags error' })).toHaveTextContent('No error');

    await screen.getByRole('button', { name: 'Clear all errors' }).click();
    await screen.getByLabelText('City').fill('London');
    await screen.getByLabelText('First tag').fill('');
    await screen
      .getByRole('button', {
        name: 'Validate',
        exact: true,
      })
      .click();

    await expect.element(screen.getByRole('status', { name: 'Validation result' })).toHaveTextContent('false');
    await expect.element(screen.getByRole('status', { name: 'Tags error' })).toHaveTextContent('No error');

    await screen.getByRole('button', { name: 'Clear all errors' }).click();
    await screen.getByLabelText('First tag').fill('reader');
    await screen
      .getByRole('button', {
        name: 'Validate',
        exact: true,
      })
      .click();

    await expect.element(screen.getByRole('status', { name: 'Validation result' })).toHaveTextContent('true');
  });

  test('manages manual errors', async () => {
    const screen = await render(ValidationForm);

    await screen.getByRole('button', { name: 'Set email error' }).click();
    await screen.getByRole('button', { name: 'Set name error' }).click();

    await expect.element(screen.getByRole('status', { name: 'Email has error' })).toHaveTextContent('true');

    await screen.getByRole('button', { name: 'Replace email error' }).click();

    const messages = screen.getByRole('list', { name: 'Validation messages' }).getByRole('listitem');
    await expect.element(messages).toHaveTextContent('Email unavailable');
    await expect.poll(() => messages.all().length).toBe(1);
    await expect.element(screen.getByRole('status', { name: 'Email error' })).toHaveTextContent('Email unavailable');

    await screen.getByRole('button', { name: 'Clear email error' }).click();

    await expect.element(messages).not.toBeInTheDocument();
    await expect.element(screen.getByRole('status', { name: 'Email has error' })).toHaveTextContent('false');
    await expect.element(screen.getByRole('status', { name: 'Name error' })).toHaveTextContent('Name rejected');

    await screen.getByRole('button', { name: 'Set email error' }).click();
    await screen.getByRole('button', { name: 'Clear all errors' }).click();

    await expect.element(screen.getByRole('status', { name: 'Email error' })).toHaveTextContent('No error');
    await expect.element(screen.getByRole('status', { name: 'Name error' })).toHaveTextContent('No error');
  });

  test('applies rule changes', async () => {
    const screen = await render(ValidationForm);

    await screen.getByLabelText('Email').fill('ada@example.com');
    await screen.getByLabelText('Name').fill('Ada');
    await screen.getByLabelText('City').fill('London');
    await screen.getByLabelText('First tag').fill('reader');
    await screen
      .getByRole('button', {
        name: 'Validate',
        exact: true,
      })
      .click();

    await expect.element(screen.getByRole('status', { name: 'Validation result' })).toHaveTextContent('true');

    await screen.getByRole('button', { name: 'Require Paris city' }).click();
    await screen
      .getByRole('button', {
        name: 'Validate',
        exact: true,
      })
      .click();

    await expect.element(screen.getByRole('status', { name: 'Validation result' })).toHaveTextContent('false');

    await screen.getByLabelText('City').fill('Paris');
    await screen.getByRole('button', { name: 'Clear all errors' }).click();
    await screen
      .getByRole('button', {
        name: 'Validate',
        exact: true,
      })
      .click();

    await expect.element(screen.getByRole('status', { name: 'Validation result' })).toHaveTextContent('true');
  });

  test('handles async validation', async () => {
    let validation = Promise.withResolvers<void>();
    const screen = await render(SubmissionForm, { props: { validate: async () => validation.promise } });

    await screen.getByLabelText('Email').fill('ada@example.com');
    await screen
      .getByRole('button', {
        name: 'Validate',
        exact: true,
      })
      .click();

    await expect.element(screen.getByRole('status', { name: 'Validation result' })).toHaveTextContent('Pending');

    validation.reject(new Error('Email unavailable'));

    await expect.element(screen.getByRole('status', { name: 'Validation result' })).toHaveTextContent('false');
    await expect.element(screen.getByRole('status', { name: 'Email error' })).toHaveTextContent('Email unavailable');

    validation = Promise.withResolvers<void>();
    await screen.getByRole('button', { name: 'Clear all errors' }).click();
    await screen
      .getByRole('button', {
        name: 'Validate',
        exact: true,
      })
      .click();

    await expect.element(screen.getByRole('status', { name: 'Validation result' })).toHaveTextContent('Pending');

    validation.resolve();

    await expect.element(screen.getByRole('status', { name: 'Validation result' })).toHaveTextContent('true');
    await expect.element(screen.getByRole('status', { name: 'Email error' })).toHaveTextContent('No error');
  });
});
