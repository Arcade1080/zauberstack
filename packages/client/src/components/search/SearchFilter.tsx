import { Box, Group } from '@mantine/core';
import { Children, cloneElement } from 'react';
import Debug from '../common/Debug';
import { useSearch } from './SearchProvider';

export interface ListFilterControlProps {
  onChange?: any;
  value?: any;
  filterKey: string;
}

interface SearchFilterProps {
  children: any;
  debug?: boolean;
}

const SearchFilter = ({ debug, children }: SearchFilterProps) => {
  // @ts-ignore
  const { searchState, updateSearchState } = useSearch();

  const handleFilterChange = (key: string, value: any, customLogic = null) => {
    let updatedState = { ...searchState, [key]: value };

    if (typeof customLogic === 'function') {
      // @ts-ignore
      updatedState = customLogic(updatedState);
    }

    updateSearchState(updatedState);
  };

  const filter = Children.map(children, (child) =>
    cloneElement(child, {
      onChange: (value: any, customLogic: any) =>
        handleFilterChange(child.props.filterKey, value, customLogic),
      value: searchState[child.props.filterKey],
      ...child.props,
    }),
  );

  return (
    <Box>
      {debug && <Debug values={searchState} />}
      <Group gap="lg">{filter}</Group>
    </Box>
  );
};

export default SearchFilter;
