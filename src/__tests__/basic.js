import 'jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent, cleanup } from 'react-testing-library';
import { useCheckboxes } from '../index';

const items = Array.from({ length: 6 }, (v, k) => ({ id: k }));
const App = () => {
  const {
    getCheckboxProps,
    setCheckedItems,
    reset,
    disabledItems,
    checkedItems,
  } = useCheckboxes({
    items,
    defaultItems: [items[0], items[1]],
    defaultDisabledItems: [items[2], items[4]],
  });

  return (
    <div className="App">
      <CheckboxList
        items={items}
        checkedItems={checkedItems}
        disabledItems={disabledItems}
        getCheckboxProps={getCheckboxProps}
      />
      <button
        data-testid="check-all-btn"
        onClick={() => setCheckedItems(items)}
      >
        Check all
      </button>
      <button data-testid="reset-btn" onClick={reset}>
        Reset
      </button>
    </div>
  );
};

const noop = () => {};
const CheckboxList = ({
  items,
  onSelectItem,
  checkedItems,
  onChange,
  getCheckboxProps,
  disabledItems,
}) => {
  return (
    <div>
      {items.map(item => (
        <input
          key={item.id}
          data-testid={item.id}
          type="checkbox"
          checked={checkedItems.includes(item)}
          onChange={noop}
          {...getCheckboxProps({ item })}
        />
      ))}
    </div>
  );
};

test('expect the all checkboxes to have the correct state after init', () => {
  const { getByTestId } = render(<App />);
  [
    { id: '0', result: true },
    { id: '1', result: true },
    { id: '2', result: false },
    { id: '3', result: false },
    { id: '4', result: false },
    { id: '5', result: false },
  ].forEach(({ id, result }) => {
    const checkbox = getByTestId(id);
    expect(checkbox.checked).toBe(result);
  });
});

test('make sure click work properly when checking non-disabled checkbox', () => {
  const { getByTestId } = render(<App />);
  const checkbox__0 = getByTestId('0');
  expect(checkbox__0.checked).toBe(true);
  fireEvent.click(checkbox__0);
  expect(checkbox__0.checked).toBe(false);

  const checkbox__5 = getByTestId('5');
  expect(checkbox__5.checked).toBe(false);
  fireEvent.click(checkbox__5);
  expect(checkbox__5.checked).toBe(true);
});

test('make sure the disabled one cannot be checked', () => {
  const { getByTestId } = render(<App />);
  const checkbox__2 = getByTestId('2');
  expect(checkbox__2.checked).toBe(false);
  fireEvent.click(checkbox__2);
  expect(checkbox__2.checked).toBe(false);
});

afterEach(cleanup);
test('Accept "Enter" press', () => {
  const { getByTestId } = render(<App />);
  const checkbox__5 = getByTestId('5');
  expect(checkbox__5.checked).toBe(false);
  fireEvent.keyDown(checkbox__5, { key: 'Enter', code: 13 });
  expect(checkbox__5.checked).toBe(true);
});

afterEach(cleanup);
test('Accept "Enter" press', () => {
  const { getByTestId } = render(<App />);
  const checkbox__5 = getByTestId('5');
  expect(checkbox__5.checked).toBe(false);
  fireEvent.keyDown(checkbox__5, { key: 'Enter', code: 13 });
  expect(checkbox__5.checked).toBe(true);
});

afterEach(cleanup);
test('Test with "shift" + mouse click', () => {
  const { getByTestId } = render(<App />);
  const checkbox__0 = getByTestId('0');
  const checkbox__1 = getByTestId('1');
  const checkbox__3 = getByTestId('3');
  const checkbox__5 = getByTestId('5');
  fireEvent.click(checkbox__0);
  fireEvent.click(checkbox__5, { shiftKey: true });
  [
    { id: '0', result: true },
    { id: '1', result: true },
    { id: '2', result: false }, // disable
    { id: '3', result: true },
    { id: '4', result: false }, // disable
    { id: '5', result: true },
  ].forEach(({ id, result }) => {
    const checkbox = getByTestId(id);
    expect(checkbox.checked).toBe(result);
  });
  fireEvent.click(checkbox__0, { shiftKey: true });
  [
    { id: '0', result: false },
    { id: '1', result: false },
    { id: '2', result: false }, // disable
    { id: '3', result: false },
    { id: '4', result: false }, // disable
    { id: '5', result: false },
  ].forEach(({ id, result }) => {
    const checkbox = getByTestId(id);
    expect(checkbox.checked).toBe(result);
  });
  fireEvent.click(checkbox__3);
  fireEvent.click(checkbox__1, { shiftKey: true });
  [
    { id: '0', result: false },
    { id: '1', result: true },
    { id: '2', result: false }, // disable
    { id: '3', result: true },
    { id: '4', result: false }, // disable
    { id: '5', result: false },
  ].forEach(({ id, result }) => {
    const checkbox = getByTestId(id);
    expect(checkbox.checked).toBe(result);
  });
});

afterEach(cleanup);
test('Fire check all and reset button', () => {
  const { getByTestId } = render(<App />);
  fireEvent.click(getByTestId('check-all-btn'));
  [
    { id: '0', result: true },
    { id: '1', result: true },
    { id: '2', result: false }, // disable
    { id: '3', result: true },
    { id: '4', result: false }, // disable
    { id: '5', result: true },
  ].forEach(({ id, result }) => {
    const checkbox = getByTestId(id);
    expect(checkbox.checked).toBe(result);
  });
  fireEvent.click(getByTestId('reset-btn'));
  [
    { id: '0', result: false },
    { id: '1', result: false },
    { id: '2', result: false }, // disable
    { id: '3', result: false },
    { id: '4', result: false }, // disable
    { id: '5', result: false },
  ].forEach(({ id, result }) => {
    const checkbox = getByTestId(id);
    expect(checkbox.checked).toBe(result);
  });
});
