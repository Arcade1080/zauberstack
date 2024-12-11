import {
  Anchor,
  Button,
  Group,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { useSendResetPasswordMutation } from '../../../hooks/useForgotPasswordMutation';
import { Paths } from '../../../routes/paths';
import FormBase, { FORM_MODE } from '../../../components/forms/FormBase';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address.')
    .required('Please enter an email address.'),
});

type ForgotPasswordFormProps = {
  onSubmit: (data: any) => void;
};

const ForgotPasswordForm = ({ onSubmit }: ForgotPasswordFormProps) => (
  <>
    <Title order={1} size="h1">
      Forgot Password?
    </Title>
    <Space h="xs" />
    <Text>
      Type in your email address and we&apos;ll send you instructions to reset
      it.
    </Text>
    <Space h="xl" />

    <FormBase
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      submitAction={useSendResetPasswordMutation}
      mode={FORM_MODE.CREATE}
    >
      {(form) => (
        <>
          <Stack gap="0">
            <TextInput
              required
              size="md"
              label="Email"
              placeholder="Enter your email address"
              {...form.getInputProps('email')}
            />
            <Space h="lg" />
            <Button size="md" disabled={form.isSubmitting} type="submit">
              Reset password
            </Button>
          </Stack>
          <Space h="xl" />
          <Group justify="space-between">
            <Anchor size="xs" component={Link} to={Paths.SignIn}>
              Remember your password?
            </Anchor>
          </Group>
        </>
      )}
    </FormBase>
  </>
);

export default ForgotPasswordForm;
