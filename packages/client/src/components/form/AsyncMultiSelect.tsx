import { useApolloClient, useQuery } from '@apollo/client';
import { Loader, MultiSelect } from '@mantine/core';
import React, { useState } from 'react';
import { NotificationType, showNotification } from '../../utils/utils';

interface AsyncMultiselectProps<T> {
  loaderQuery: any;
  createMutation?: any;
  selectedValues: T[];
  clearable?: boolean;
  loaderQueryVariables?: any;
  label: string;
  entityId: string;
  placeholder?: string;
  formatData: (data: any) => any;
  onChange: (newValues: T[]) => void;
  renderOption?: (option: T) => React.ReactNode;
}

const AsyncMultiSelect = ({
  loaderQuery,
  createMutation,
  entityId,
  loaderQueryVariables,
  selectedValues,
  clearable,
  label,
  formatData,
  placeholder,
  onChange,
  renderOption = (option: any) => String(option),
  ...otherProps
  // @ts-ignore
}: AsyncMultiselectProps) => {
  const apolloClient = useApolloClient();

  const { loading, data, refetch } = useQuery(loaderQuery, {
    fetchPolicy: 'network-only',
    ...loaderQueryVariables,
  });

  const [creatingItem, setCreatingItem] = useState(false);

  const creatable = !!createMutation;

  const _internalOnChange = (newValues: any) => {
    if (newValues && newValues.includes(undefined)) {
      return;
    }

    onChange(newValues);
  };

  const handleCreateItem = async (newItem: string) => {
    if (!creatable) return {};
    try {
      setCreatingItem(true);
      const trimmedItem = newItem.trim();
      if (!trimmedItem) {
        throw new Error('Item name cannot be empty.');
      }

      const { data: createdItem } = await apolloClient.mutate({
        variables: { name: trimmedItem },
        mutation: createMutation,
      });

      setCreatingItem(false);

      const updatedValues = !selectedValues
        ? // @ts-ignore
          [createdItem[entityId].id]
        : // @ts-ignore
          [...selectedValues, createdItem[entityId].id];

      onChange(updatedValues);

      await refetch();

      return {
        // @ts-ignore
        value: createdItem[entityId].id,
        // @ts-ignore
        label: createdItem[entityId].name,
      };
    } catch (error) {
      setCreatingItem(false);
      showNotification({
        title: 'There was an error creating the item:',
        error,
        notificationType: NotificationType.ERROR,
      });
      return null;
    }
  };

  const _formatData = (input: any) => {
    if (!input) return [];
    return formatData(input);
  };

  return (
    <>
      <MultiSelect
        /** @ts-ignore  */
        data={_formatData(data)}
        size="md"
        getCreateLabel={(query: string) => `+ Create ${query}`}
        /** @ts-ignore  */
        value={selectedValues}
        /** @ts-ignore  */
        onChange={_internalOnChange}
        placeholder={placeholder}
        label={label}
        clearSearchOnChange
        searchable
        clearable={clearable}
        creatable={creatable}
        rightSection={loading || creatingItem ? <Loader size={16} /> : null}
        itemRenderer={(option: any) => renderOption(option)}
        /** @ts-ignore  */
        onCreate={(newItem) => handleCreateItem(newItem)}
        {...otherProps}
      />
    </>
  );
};

export default AsyncMultiSelect;
