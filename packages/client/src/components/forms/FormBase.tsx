import { ApolloError, useApolloClient } from '@apollo/client';
import { Box, LoadingOverlay } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { useEffect, useState } from 'react';
import ErrorService from '../../services/errors/ErrorService';
import Debug from '../common/Debug';
import ErrorDisplay from '../common/ErrorDisplay';

export const FORM_MODE = {
  CREATE: 'create',
  EDIT: 'edit',
};

function flattenErrorMessages(errors: any) {
  const flatErrors: { [key: string]: string } = {};

  for (const key in errors) {
    if (Object.prototype.hasOwnProperty.call(errors, key)) {
      const error = errors[key];
      const message = ErrorService.getMessageForInputValidationErrorCode(error);
      flatErrors[key] = message;
    }
  }

  return flatErrors;
}

type FormBaseProps = {
  validationSchema?: any;
  queryVariables?: any;
  mode: string;
  submitAction: () => Array<any>;
  onSubmit?: (values: any) => void;
  formatPreSubmit?: (data: any) => any;
  loader?: any;
  entityId?: string;
  debug?: boolean;
  entityKey?: string;
  disabled?: boolean;
  children: (values: any) => any;
  formatInitialValues?: (data: any) => any;
  initialValues?: any;
};

const FormBase = ({
  validationSchema,
  loader,
  formatInitialValues,
  formatPreSubmit,
  submitAction,
  onSubmit,
  mode,
  debug = false,
  queryVariables,
  children,
  initialValues,
}: FormBaseProps) => {
  const [formSubmitErrors, setFormErrors] = useState({});
  const [fetching, setLoading] = useState(false);

  const client = useApolloClient();

  const [submit, { loading: submitting }] = submitAction();

  useEffect(() => {
    if (mode === FORM_MODE.CREATE) {
      return;
    }

    setLoading(true);

    client
      .query({
        query: loader,
        variables: queryVariables,
      })
      .then((result) => {
        let _data = result.data;

        if (formatInitialValues && typeof formatInitialValues === 'function') {
          _data = formatInitialValues(result.data);
        }
        form.setValues(_data);
        form.resetDirty(_data);
      })
      .catch((e: ApolloError) => {
        const errors = ErrorService.getErrors(e);
        setFormErrors(errors);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const form = useForm({
    validateInputOnBlur: true,
    initialValues,
    validate: yupResolver(validationSchema),
  });

  const [formSubmitErrorMessage, setFormSubmitErrorMessage] = useState('');

  const onFormSubmit = (data: any) => {
    form.clearErrors();
    const formattedData = formatPreSubmit ? formatPreSubmit(data) : data;
    submit(formattedData)
      .then(({ data: result }: any) => {
        onSubmit && onSubmit(result);
      })
      .catch((e: ApolloError) => {
        const errors = ErrorService.getErrors(e);
        setFormErrors(errors);
      });
  };

  const handleFormSubmitErrors = (errors: any) => {
    const { errorMessage, inputErrors } = errors;
    setFormSubmitErrorMessage(errorMessage);
    form.setErrors(flattenErrorMessages(inputErrors));
  };

  useEffect(() => {
    form.clearErrors();
    setFormSubmitErrorMessage('');
    if (Object.keys(formSubmitErrors).length > 0) {
      handleFormSubmitErrors(formSubmitErrors);
    }
  }, [formSubmitErrors]);

  return (
    <Box pos="relative">
      {formSubmitErrorMessage && (
        <ErrorDisplay errorMessage={formSubmitErrorMessage} />
      )}
      <form onSubmit={form.onSubmit(onFormSubmit)}>
        {/* <LoadingOverlay visible={fetching || submitting} /> */}
        {children(form)}
      </form>
      {debug && <Debug values={form.values} />}
    </Box>
  );
};

export default FormBase;
