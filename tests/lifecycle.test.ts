import { render } from 'vitest-browser-vue';
import ValidationForm from './fixtures/ValidationForm.vue';

describe('Lifecycle', () => {
  test('supports destroy and unmount', async () => {
    const screen = await render(ValidationForm);

    await screen
      .getByRole('button', {
        name: 'Destroy',
        exact: true,
      })
      .click();
    await screen
      .getByRole('button', {
        name: 'Destroy',
        exact: true,
      })
      .click();
    await screen.getByLabelText('Email').fill('after@example.com');

    await expect.element(screen.getByLabelText('Email')).toHaveValue('after@example.com');

    await screen.unmount();

    await expect
      .element(
        screen.getByRole('button', {
          name: 'Destroy',
          exact: true,
        }),
      )
      .not.toBeInTheDocument();

    const fresh = await render(ValidationForm);

    await expect.element(fresh.getByLabelText('Email')).toHaveValue('');

    await fresh
      .getByRole('button', {
        name: 'Validate',
        exact: true,
      })
      .click();

    await expect.element(fresh.getByRole('status', { name: 'Validation result' })).toHaveTextContent('false');
    await expect.element(fresh.getByRole('status', { name: 'Email error' })).toHaveTextContent('Enter a valid email');

    await fresh.unmount();
  });
});
