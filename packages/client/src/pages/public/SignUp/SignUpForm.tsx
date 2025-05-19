import {
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
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { IconBrandGoogle } from '@tabler/icons-react';
import FormBase, { FORM_MODE } from '../../../components/forms/FormBase';
import { useAcceptInvitationMutation } from '../../../hooks/useAcceptInvitationMutation';
import { useSignUpMutation } from '../../../hooks/useSignUpMutation';
import { Paths } from '../../../routes/paths';

export type SignUpFormValues = {
  owner: {
    email: string;
    password: string;
  };
  organization?: {
    name: string;
  };
};

interface SignUpFormProps {
  token?: string | undefined | null;
  invitational: boolean;
  email?: string | undefined | null;
}

const SignUpForm = ({ invitational, token, email }: SignUpFormProps) => {
  const validationSchema = !invitational
    ? Yup.object().shape({
        owner: Yup.object().shape({
          email: Yup.string().email('Please enter a valid email address.'),
          password: Yup.string().min(
            6,
            'Your password should have at least 6 characters.',
          ),
        }),
        organization: Yup.object().shape({
          name: Yup.string()
            .min(1, 'Please enter the name of your organization.')
            .nullable(),
        }),
      })
    : Yup.object().shape({
        owner: Yup.object().shape({
          email: Yup.string().email('Please enter a valid email address.'),
          password: Yup.string().min(
            6,
            'Your password should have at least 6 characters.',
          ),
        }),
      });

  return (
    <>
      <Title order={1} size="h1">
        Let´s do this!
      </Title>
      <Space h="xs" />
      <Text size="xl">Create an account and get started now!</Text>
      <Space h="xl" />

      <FormBase
        initialValues={{
          owner: {
            email: email || '',
            password: '',
          },
          organization: {
            name: '',
          },
        }}
        formatInitialValues={(data: any) => data}
        formatPreSubmit={(data: any) => {
          if (invitational) {
            return {
              user: {
                ...data.owner,
              },
              token,
            };
          }
          return data;
        }}
        submitAction={token ? useAcceptInvitationMutation : useSignUpMutation}
        validationSchema={validationSchema}
        mode={FORM_MODE.CREATE}
      >
        {(form: any) => (
          <>
            <Stack gap="0" justify="left">
              <TextInput
                size="md"
                required
                label="Email"
                placeholder="Enter your email address"
                {...form.getInputProps('owner.email')}
              />
              <Space h="md" />
              <PasswordInput
                required
                size="md"
                label="Password"
                description="Use 6 or more characters with a mix of letters, numbers and symbols"
                placeholder="Enter your password"
                {...form.getInputProps('owner.password')}
              />
              <Space h="md" />
              {!invitational && (
                <TextInput
                  required
                  size="md"
                  label="What is the name of your organization?"
                  placeholder="Enter the name of your organization"
                  {...form.getInputProps('organization.name')}
                />
              )}
              <Space h="lg" />
              <Button size="md" disabled={form.isSubmitting} type="submit">
                Sign up
              </Button>
              <Divider my="xs" />
              <Button
                size="md"
                onClick={() => {
                  const apiUrl =
                    import.meta.env.VITE_API_URL || 'http://localhost:3000';
                  window.location.href = `${apiUrl}/auth/google`;
                }}
                leftSection={<IconBrandGoogle />}
              >
                Sign up with Google
              </Button>
            </Stack>
            <Space h="xl" />
            <Group>
              {!invitational && (
                <Anchor size="xs" component={Link} to={Paths.SignIn}>
                  Already have an account? Sign in!
                </Anchor>
              )}
            </Group>
          </>
        )}
      </FormBase>
    </>
  );
};

export default SignUpForm;
