import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface ErrorDisplayProps {
  errorMessage: string;
}

const ErrorDisplay = ({ errorMessage }: ErrorDisplayProps) => (
  <Alert my={8} color="red" mt="md" icon={<IconAlertCircle />}>
    {errorMessage}
  </Alert>
);

export default ErrorDisplay;
