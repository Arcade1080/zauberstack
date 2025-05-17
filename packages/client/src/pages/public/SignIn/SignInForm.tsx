import {
  Alert,
  Anchor,
  Button,
  Divider,
  Group,
  PasswordInput,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import FormBase, { FORM_MODE } from '../../../components/forms/FormBase';
import { useSignInMutation } from '../../../hooks/useLoginMutation';
import { useRequestMagicLinkMutation } from '../../../hooks/useRequestMagicLinkMutation';
import { Paths } from '../../../routes/paths';
import GoogleSignInButton from '../../../components/auth/GoogleSignInButton';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Please enter a valid email address.'),
  password: Yup.string().min(
    6,
    'Your password should have at least 6 characters.',
  ),
});

const SignInForm = () => {
  const [emailLoginViaPassword, setEmailLoginViaPassword] = useState(true);
  const [showSuccessMessageForMagicLink, setShowSuccessMessageForMagicLink] =
    useState(false);

  const onSubmit = () => {
    setShowSuccessMessageForMagicLink(true);
  };

  return (
    <>
      {showSuccessMessageForMagicLink && (
        <>
          <Alert
            variant="light"
            withCloseButton
            onClose={() => setShowSuccessMessageForMagicLink(false)}
            color="lime"
            title="Check your inbox!"
          >
            We´ve sent you a magic link to sign in.
          </Alert>
          <Space h="md" />
        </>
      )}
      <Title order={1} size="h1">
        Hello, who's this?
      </Title>
      <Space h="xs" />
      <Text size="xl">Sign in to your account</Text>
      <Space h="xl" />

      <FormBase
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        mode={FORM_MODE.CREATE}
        submitAction={
          emailLoginViaPassword
            ? useSignInMutation
            : useRequestMagicLinkMutation
        }
        initialValues={{
          email: 'admin@zauberstack.com',
          password: 'secret42',
        }}
      >
        {(form: any) => (
          <>
            <Stack gap="0" justify="left">
              <TextInput
                required
                label="Email"
                size="md"
                description={
                  !emailLoginViaPassword &&
                  'We´ll send you a magic link to sign in.'
                }
                placeholder="hello@mantine.dev"
                {...form.getInputProps('email')}
              />
              {emailLoginViaPassword ? (
                <>
                  <Space h="md" />
                  <PasswordInput
                    required
                    id="password"
                    label="Password"
                    size="md"
                    placeholder="Your password"
                    {...form.getInputProps('password')}
                  />
                  <Space h="md" />
                  <Group justify="center">
                    <Anchor
                      size="sm"
                      onClick={() =>
                        setEmailLoginViaPassword(!emailLoginViaPassword)
                      }
                    >
                      Sign in without a password
                    </Anchor>
                  </Group>
                </>
              ) : (
                <>
                  <Space h="md" />
                  <Group justify="space-between">
                    <Anchor
                      size="sm"
                      onClick={() =>
                        setEmailLoginViaPassword(!emailLoginViaPassword)
                      }
                    >
                      Use password instead
                    </Anchor>
                  </Group>
                </>
              )}

              <Space h="lg" />
              <Button size="md" disabled={form.submitting} type="submit">
                {emailLoginViaPassword ? 'Sign in' : 'Send magic link'}
              </Button>

              <Divider my="xs" label="OR" labelPosition="center" />

              <GoogleSignInButton fullWidth />
            </Stack>
            <Space h="xl" />
            <Group justify="space-between" mb="md">
              <Anchor size="xs" component={Link} to={Paths.SignUp}>
                Don&apos;t have an account yet? Sign up!
              </Anchor>
              <Anchor size="xs" component={Link} to={Paths.ForgotPassword}>
                Forgot password?
              </Anchor>
            </Group>
          </>
        )}
      </FormBase>
    </>
  );
};

export default SignInForm;
