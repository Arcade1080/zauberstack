import { useApolloClient, useQuery } from '@apollo/client';
import {
  Combobox,
  Group,
  Pill,
  PillsInput,
  ScrollArea,
  useCombobox,
} from '@mantine/core';
import { useState } from 'react';
import { NotificationType, showNotification } from '../../utils/utils';

type ComboMultiSelectProps = {
  loaderQuery: any;
  formatData: (data: any) => any[];
  loaderQueryVariables?: any;
  onChange: (values: any) => void;
  selectedValues: any[];
  createMutationConfig: any;
  placeholder: string;
  size: string;
  label?: string;
};

export function ComboMultiSelect({
  loaderQuery,
  formatData,
  loaderQueryVariables,
  onChange,
  selectedValues,
  createMutationConfig,
  placeholder,
  size,
  label,
}: ComboMultiSelectProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });

  const { data: loadedOptions, refetch } = useQuery(loaderQuery, {
    fetchPolicy: 'network-only',
    ...loaderQueryVariables,
  });

  const _formatData = (data: any) => {
    if (!data) return [];
    return formatData(data);
  };

  const [search, setSearch] = useState('');
  const apolloClient = useApolloClient();

  const exactOptionMatch = _formatData(loadedOptions).some(
    (item: any) => item.label === search,
  );

  const handleCreateItem = async (lablForNewItem: string) => {
    try {
      const trimmedItem = lablForNewItem.trim();
      if (!trimmedItem) {
        throw new Error('Name cannot be empty.');
      }

      const { data } = await apolloClient.mutate({
        mutation: createMutationConfig.mutation,
        variables: createMutationConfig.variables(trimmedItem),
      });

      const updatedValues = !selectedValues
        ? [createMutationConfig.formatMutationResponse(data)]
        : [
            ...selectedValues,
            createMutationConfig.formatMutationResponse(data),
          ];

      onChange(updatedValues);

      await refetch();
      return null;
    } catch (error: any) {
      showNotification({
        title: 'There was an error creating the item:',
        error,
        notificationType: NotificationType.ERROR,
      });
      return null;
    }
  };

  const handleValueSelect = (val: string) => {
    setSearch('');
    if (val === '$create') {
      handleCreateItem(search);
    } else {
      selectedValues.includes(val)
        ? onChange(selectedValues.filter((v: string) => v !== val))
        : onChange([...selectedValues, val]);
    }
  };

  const handleValueRemove = (val: string) => {
    onChange(selectedValues.filter((v: string) => v !== val));
  };

  const currentlySelectedValues = selectedValues.map((id: string) => {
    const selectedItemLabel = _formatData(loadedOptions).find(
      (item: any) => item.value === id,
    )?.label;

    return (
      <Pill key={id} withRemoveButton onRemove={() => handleValueRemove(id)}>
        {selectedItemLabel}
      </Pill>
    );
  });

  const availableOptions = _formatData(loadedOptions)
    .filter((item: any) =>
      item.label.toLowerCase().includes(search.trim().toLowerCase()),
    )
    .filter((item: any) => !selectedValues.includes(item.value))
    .map((item: any) => (
      <Combobox.Option
        value={item.value}
        key={item.value}
        active={selectedValues.includes(item.value)}
      >
        <Group gap="sm">
          <span>{item.label}</span>
        </Group>
      </Combobox.Option>
    ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={handleValueSelect}
      withinPortal={false}
    >
      <Combobox.DropdownTarget>
        <PillsInput
          label={label}
          size={size || 'md'}
          onClick={() => combobox.openDropdown()}
        >
          <Pill.Group>
            {currentlySelectedValues}

            <Combobox.EventsTarget>
              <PillsInput.Field
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
                value={search}
                placeholder={placeholder}
                onChange={(event) => {
                  combobox.updateSelectedOptionIndex();
                  setSearch(event.currentTarget.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Backspace' && search.length === 0) {
                    event.preventDefault();
                    handleValueRemove(
                      selectedValues[selectedValues.length - 1],
                    );
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <ScrollArea scrollbarSize={2} h={250}>
          <Combobox.Options>
            {availableOptions}

            {!exactOptionMatch && search.trim().length > 0 && (
              <Combobox.Option value="$create">
                + Create {search}
              </Combobox.Option>
            )}

            {exactOptionMatch &&
              search.trim().length > 0 &&
              availableOptions.length === 0 && (
                <Combobox.Empty>Nothing found</Combobox.Empty>
              )}
          </Combobox.Options>
        </ScrollArea>
      </Combobox.Dropdown>
    </Combobox>
  );
}
