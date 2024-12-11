import { Alert, Anchor, Text } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Paths } from '../../../routes/paths';
import AuthPageLayout from '../../layouts/authPage/AuthPageLayout';
import ForgotPasswordForm from './ForgotPasswordForm';

const ForgotPasswordPage = () => {
  const [linkSuccessfullySent, setLinkSuccessfullySent] = useState(false);

  const onSubmit = () => {
    setLinkSuccessfullySent(true);
  };
  const icon = <IconCircleCheck />;

  return (
    <AuthPageLayout>
      {linkSuccessfullySent ? (
        <>
          <Alert
            icon={icon}
            title="Almost there!"
            color="green"
            variant="light"
            mb="xl"
          >
            <Text>
              We´ve successfully sent you the instructions to reset your
              password.{' '}
            </Text>
          </Alert>
          <Anchor size="sm" component={Link} to={Paths.SignIn}>
            Back to sign in page
          </Anchor>
        </>
      ) : (
        <ForgotPasswordForm onSubmit={onSubmit} />
      )}
    </AuthPageLayout>
  );
};

export default ForgotPasswordPage;
