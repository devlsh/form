import { render } from 'vitest-browser-vue';
import BlankForm from './fixtures/BlankForm.vue';
import ValuesForm from './fixtures/ValuesForm.vue';

describe('Fields', () => {
  test('starts blank without defaults', async () => {
    const screen = await render(BlankForm);

    await expect.element(screen.getByLabelText('Name')).toHaveValue('');

    await screen.getByLabelText('Name').fill('Ada');

    await expect.element(screen.getByRole('status', { name: 'Current name' })).toHaveTextContent('Ada');

    await screen
      .getByRole('button', {
        name: 'Submit',
        exact: true,
      })
      .click();

    await expect.poll(() => screen.emitted('submitted')).toEqual([[{ name: 'Ada' }]]);

    await screen
      .getByRole('button', {
        name: 'Reset',
        exact: true,
      })
      .click();

    await expect.element(screen.getByLabelText('Name')).toHaveValue('');
    await expect.element(screen.getByRole('status', { name: 'Current name' })).toBeEmptyDOMElement();
  });

  test('preserves defaults', async () => {
    const screen = await render(ValuesForm);

    await expect.element(screen.getByLabelText('Name')).toHaveValue('Ada');
    await expect.element(screen.getByLabelText('Count')).toHaveValue('0');
    await expect.element(screen.getByLabelText('Enabled')).not.toBeChecked();
    await expect.element(screen.getByLabelText('Unset')).toHaveValue('');
    await expect.element(screen.getByLabelText('No default')).toHaveValue('');

    await expect.element(screen.getByRole('status', { name: 'Current name' })).toHaveTextContent('Ada');
    await expect.element(screen.getByRole('status', { name: 'Current count' })).toHaveTextContent('number: 0');
    await expect.element(screen.getByRole('status', { name: 'Current enabled' })).toHaveTextContent('false');
    await expect.element(screen.getByRole('status', { name: 'Current nullable' })).toHaveTextContent('null');
    await expect.element(screen.getByRole('status', { name: 'Current unset' })).toBeEmptyDOMElement();

    await expect.element(screen.getByRole('status', { name: 'Current city' })).toHaveTextContent('London');
    await expect
      .element(screen.getByRole('list', { name: 'Current tags' }).getByRole('listitem'))
      .toHaveTextContent('reader');
    await expect.element(screen.getByRole('status', { name: 'Current blank' })).toBeEmptyDOMElement();
  });

  test('updates field values', async () => {
    const screen = await render(ValuesForm);

    await screen.getByLabelText('Name').fill('Grace');
    await screen.getByLabelText('Count').fill('7');
    await screen.getByLabelText('Enabled').click();
    await screen.getByLabelText('Nullable').fill('present');
    await screen.getByLabelText('Unset').fill('set');

    await screen.getByLabelText('City').fill('Paris');
    await screen.getByLabelText('First tag').fill('writer');

    await expect.element(screen.getByRole('status', { name: 'Current name' })).toHaveTextContent('Grace');
    await expect.element(screen.getByRole('status', { name: 'Current count' })).toHaveTextContent('number: 7');
    await expect.element(screen.getByRole('status', { name: 'Current enabled' })).toHaveTextContent('true');
    await expect.element(screen.getByRole('status', { name: 'Current nullable' })).toHaveTextContent('present');
    await expect.element(screen.getByRole('status', { name: 'Current unset' })).toHaveTextContent('set');

    await expect.element(screen.getByRole('status', { name: 'Current city' })).toHaveTextContent('Paris');
    await expect
      .element(screen.getByRole('list', { name: 'Current tags' }).getByRole('listitem'))
      .toHaveTextContent('writer');
    await expect.element(screen.getByRole('status', { name: 'Current blank' })).toBeEmptyDOMElement();

    await screen
      .getByRole('button', {
        name: 'Submit',
        exact: true,
      })
      .click();

    await expect
      .poll(() => screen.emitted('submitted'))
      .toEqual([
        [
          {
            name: 'Grace',
            count: 7,
            enabled: true,
            nullable: 'present',
            unset: 'set',
            profile: { city: 'Paris' },
            tags: ['writer'],
            blank: '',
          },
        ],
      ]);
  });

  test('resets values and errors', async () => {
    const screen = await render(ValuesForm);

    await screen.getByLabelText('Name').fill('Changed');
    await screen.getByLabelText('Count').fill('3');
    await screen.getByLabelText('Enabled').click();
    await screen.getByLabelText('Nullable').fill('Changed');
    await screen.getByLabelText('Unset').fill('Changed');
    await screen.getByLabelText('No default').fill('Changed');
    await screen.getByRole('button', { name: 'Set name error' }).click();

    await expect.element(screen.getByRole('status', { name: 'Name error' })).toHaveTextContent('Name rejected');

    await screen
      .getByRole('button', {
        name: 'Reset',
        exact: true,
      })
      .click();

    await expect.element(screen.getByLabelText('Name')).toHaveValue('Ada');
    await expect.element(screen.getByLabelText('Count')).toHaveValue('0');
    await expect.element(screen.getByLabelText('Enabled')).not.toBeChecked();
    await expect.element(screen.getByLabelText('Nullable')).toHaveValue('');
    await expect.element(screen.getByLabelText('Unset')).toHaveValue('');
    await expect.element(screen.getByLabelText('No default')).toHaveValue('');

    await expect.element(screen.getByRole('status', { name: 'Current name' })).toHaveTextContent('Ada');
    await expect.element(screen.getByRole('status', { name: 'Current count' })).toHaveTextContent('number: 0');
    await expect.element(screen.getByRole('status', { name: 'Current enabled' })).toHaveTextContent('false');
    await expect.element(screen.getByRole('status', { name: 'Current nullable' })).toHaveTextContent('null');
    await expect.element(screen.getByRole('status', { name: 'Current unset' })).toBeEmptyDOMElement();

    await expect.element(screen.getByRole('status', { name: 'Current city' })).toHaveTextContent('London');
    await expect
      .element(screen.getByRole('list', { name: 'Current tags' }).getByRole('listitem'))
      .toHaveTextContent('reader');
    await expect.element(screen.getByRole('status', { name: 'Current blank' })).toBeEmptyDOMElement();

    await expect.element(screen.getByRole('status', { name: 'Name error' })).toHaveTextContent('No error');
  });
});
