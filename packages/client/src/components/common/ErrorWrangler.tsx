import { ApolloError } from '@apollo/client';
import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import ErrorService from '../../services/errors/ErrorService';

export const flattenErrorMessages = (errors: any) => {
  const flatErrors: { [key: string]: string } = {};

  for (const key in errors) {
    if (Object.prototype.hasOwnProperty.call(errors, key)) {
      const error = errors[key];
      const message = ErrorService.getMessageForInputValidationErrorCode(error);
      flatErrors[key] = message;
    }
  }

  return flatErrors;
};

interface ErrorDisplayProps {
  error: ApolloError | undefined;
}

const ErrorWrangler = ({ error }: ErrorDisplayProps) => {
  if (!error) return null;

  const errors = ErrorService.getErrors(error);
  const { errorMessage } = errors;

  return (
    <Alert my={8} color="red" mt="md" icon={<IconAlertCircle />}>
      {errorMessage}
    </Alert>
  );
};

export default ErrorWrangler;
