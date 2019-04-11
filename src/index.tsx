import React, { useState } from 'react';

export interface UseCheckboxesOutput<T> {
  checkedItems: T[];
  disabledItems: T[];
  setCheckedItems: (items: T[]) => void;
  setDisabledItems: (items: T[]) => void;
  reset: () => void;
  getCheckboxProps: ({
    item,
  }: {
    item: T;
  }) => {
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
  };
}

export function useCheckboxes<T>({
  items,
  defaultItems = [],
  defaultDisabledItems = [],
}: {
  items: T[];
  defaultItems?: T[];
  defaultDisabledItems?: T[];
}): UseCheckboxesOutput<T> {
  const [checkedItems, setCheckedItems] = useState<T[]>(defaultItems);
  const [disabledItems, setDisabledItems] = useState<T[]>(defaultDisabledItems);
  const [lastItem, setLastItem] = useState();

  return {
    checkedItems,
    setCheckedItems: items => {
      setCheckedItems(items.filter(itm => !disabledItems.includes(itm)));
    },
    disabledItems,
    setDisabledItems,
    reset: () => {
      setLastItem(null);
      setCheckedItems([]);
    },
    getCheckboxProps: ({ item }) => ({
      onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key !== 'Enter') {
          return;
        }
        if (checkedItems.includes(item)) {
          setCheckedItems(checkedItems.filter(itm => itm !== item));
        } else {
          setCheckedItems([...checkedItems, item]);
        }
        setLastItem(item);
      },
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        if (event.shiftKey) {
          const itemIndex = items.findIndex(itm => itm === item);
          const lastIndex = items.findIndex(itm => itm === lastItem);
          const from = itemIndex > lastIndex ? lastIndex : itemIndex;
          const to = (itemIndex < lastIndex ? lastIndex : itemIndex) + 1;
          const slice = [...items]
            .slice(from, to)
            .filter(itm => !disabledItems.includes(itm));

          if (checkedItems.includes(item)) {
            setCheckedItems(checkedItems.filter(itm => !slice.includes(itm)));
          } else {
            setCheckedItems([
              ...checkedItems.filter(itm => !slice.includes(itm)),
              ...slice,
            ]);
          }
        } else if (!disabledItems.includes(item)) {
          if (checkedItems.includes(item)) {
            setCheckedItems(checkedItems.filter(itm => itm !== item));
          } else {
            setCheckedItems([...checkedItems, item]);
          }
        }
        setLastItem(item);
      },
    }),
  };
}
