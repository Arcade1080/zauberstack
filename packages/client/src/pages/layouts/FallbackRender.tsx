import { Alert, Anchor } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

export function FallbackRender({ error, resetErrorBoundary }: any) {
  const icon = <IconInfoCircle />;
  return (
    <Alert
      variant="light"
      color="red"
      title="Something went wrong."
      icon={icon}
    >
      We couldn´t handle the last request. This is what the error message says:{' '}
      <br />
      <pre>{error.message}</pre>
      <Anchor
        size="md"
        variant="link"
        color="red"
        style={{ marginTop: '10px' }}
        onClick={resetErrorBoundary}
      >
        Try again
      </Anchor>
    </Alert>
  );
}
