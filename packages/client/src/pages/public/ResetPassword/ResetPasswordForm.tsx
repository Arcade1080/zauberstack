import {
  Button,
  PasswordInput,
  Space,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import * as Yup from 'yup';
import FormBase, { FORM_MODE } from '../../../components/forms/FormBase';
import { useResetPasswordMutation } from '../../../hooks/useResetPasswordMutation';

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

interface ResetPasswordFormProps {
  token: string | null;
  onSubmit: (data: any) => void;
}

const ResetPasswordForm = ({ token, onSubmit }: ResetPasswordFormProps) => (
  <>
    <Title order={1} size="h1">
      Reset your password
    </Title>
    <Space h="xs" />
    <Text size="xl">Enter your new password.</Text>
    <Space h="xl" />
    <FormBase
      validationSchema={validationSchema}
      submitAction={useResetPasswordMutation}
      onSubmit={onSubmit}
      mode={FORM_MODE.CREATE}
      formatPreSubmit={(data) => ({
        ...data,
        token,
      })}
    >
      {(form) => (
        <>
          <Stack gap={0}>
            <PasswordInput
              required
              size="md"
              label="Password"
              placeholder="hello@mantine.dev"
              {...form.getInputProps('password')}
            />
            <Space h="md" />
            <PasswordInput
              required
              size="md"
              label="Confirm Password"
              placeholder="hello@mantine.dev"
              {...form.getInputProps('confirmPassword')}
            />
            <Space h="lg" />
            <Button size="md" disabled={form.isSubmitting} type="submit">
              Reset Password
            </Button>
          </Stack>
        </>
      )}
    </FormBase>
  </>
);

export default ResetPasswordForm;
