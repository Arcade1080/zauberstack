import { TextInput } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { useEffect } from 'react';

interface SearchQueryFilterProps {
  onChange?: (value: any, callback: any) => void;
  value?: any;
  filterKey: string;
}

const SearchQueryFilter = ({ onChange, value }: SearchQueryFilterProps) => {
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useDebouncedState(
    '',
    200,
  );

  useEffect(() => {
    // @ts-ignore
    onChange(debouncedSearchQuery, (state: any) => ({
      ...state,
      currentPage: 1,
    }));
  }, [debouncedSearchQuery]);

  return (
    <TextInput
      label="Search"
      size="md"
      w={300}
      placeholder="Search for title or description"
      defaultValue={value}
      onChange={(e) => setDebouncedSearchQuery(e.target.value)}
    />
  );
};

export default SearchQueryFilter;
