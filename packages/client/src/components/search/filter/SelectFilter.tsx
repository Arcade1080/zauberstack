import { Select } from '@mantine/core';

interface SelectFilterProps {
  onChange?: (value: any, callback: any) => void;
  value?: any;
  filterKey: string;
  options: any;
  handleChange: any;
  afterChange: any;
  formatValue: any;
}

const SelectFilter = ({
  onChange,
  handleChange,
  afterChange,
  value,
  formatValue,
  options,
}: SelectFilterProps) => {
  const _handleChange = (newValue: any) => {
    const callback = afterChange || undefined;
    // @ts-ignore
    onChange(handleChange ? handleChange(newValue) : newValue, callback);
  };

  return (
    <Select
      label="Status"
      placeholder="Pick one"
      size="md"
      defaultValue="all"
      onChange={_handleChange}
      value={formatValue ? formatValue(value) : value}
      data={options}
    />
  );
};

export default SelectFilter;
