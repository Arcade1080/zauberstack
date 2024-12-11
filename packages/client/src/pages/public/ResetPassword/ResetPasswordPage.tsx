import { Alert, Anchor, Text } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Paths } from '../../../routes/paths';
import AuthPageLayout from '../../layouts/authPage/AuthPageLayout';
import ResetPasswordForm from './ResetPasswordForm';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [passwordResetSuccessfully, setPasswordResetSuccessfully] =
    useState(false);

  const onSubmit = () => {
    setPasswordResetSuccessfully(true);
  };
  const token = searchParams.get('token');

  const icon = <IconCircleCheck />;

  return (
    <AuthPageLayout>
      {passwordResetSuccessfully ? (
        <>
          <Alert
            icon={icon}
            title="Done!"
            color="green"
            variant="light"
            mb="xl"
          >
            <Text>You can now sign in with your new password.</Text>
          </Alert>
          <Anchor size="sm" component={Link} to={Paths.SignIn}>
            Sign in now.
          </Anchor>
        </>
      ) : (
        <ResetPasswordForm onSubmit={onSubmit} token={token} />
      )}
    </AuthPageLayout>
  );
};

export default ResetPasswordPage;
