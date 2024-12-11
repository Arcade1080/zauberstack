import AsyncMultiSelect from '../../form/AsyncMultiSelect';

interface AsyncSelectFilterProps {
  onChange?: (value: any, callback: any) => void;
  handleChange?: (value: any) => void;
  afterChange?: (value: any) => void;
  formatOptions?: (value: any) => any;
  value?: any;
  filterKey: string;
  loaderQuery: any;
  loaderQueryVariables?: any;
  createMutation?: any;
}

const AsyncSelectFilter = ({
  onChange,
  handleChange,
  afterChange,
  value,
  loaderQuery,
  loaderQueryVariables,
  formatOptions,
}: AsyncSelectFilterProps) => {
  const _handleChange = (newValue: any) => {
    const callback = afterChange || undefined;
    // @ts-ignore
    onChange(handleChange ? handleChange(newValue) : newValue, callback);
  };

  return (
    <AsyncMultiSelect
      loaderQuery={loaderQuery}
      loaderQueryVariables={loaderQueryVariables}
      placeholder="Select tags"
      label="Select tags"
      entityId="createTag"
      clearable
      selectedValues={value}
      // @ts-ignore
      formatData={formatOptions}
      onChange={_handleChange}
    />
  );
};

export default AsyncSelectFilter;
