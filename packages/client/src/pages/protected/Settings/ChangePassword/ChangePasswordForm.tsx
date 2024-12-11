import { Button, Group, PasswordInput, Stack } from '@mantine/core';
import * as Yup from 'yup';
import FormBase, { FORM_MODE } from '../../../../components/forms/FormBase';
import Section from '../../../../components/page/Section';
import { useChangePasswordMutation } from '../../../../hooks/useChangePasswordMutation';

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Please enter a title'),
  newPassword: Yup.string().required('Please enter a description'),
});

interface ChangePasswordFormProps {
  onSubmit: () => void;
}

const ChangePasswordForm = ({ onSubmit }: ChangePasswordFormProps) => (
  <FormBase
    onSubmit={onSubmit}
    submitAction={useChangePasswordMutation}
    mode={FORM_MODE.CREATE}
    validationSchema={validationSchema}
    initialValues={{
      oldPassword: '',
      newPassword: '',
    }}
  >
    {(form: any) => (
      <>
        <Section
          heading="New password"
          description="Your password must be at least 8 characters long."
        >
          <Stack gap="lg" maw={400}>
            <PasswordInput
              required
              size="md"
              label="Current password"
              placeholder="Enter your current password."
              {...form.getInputProps('oldPassword')}
            />
            <PasswordInput
              required
              size="md"
              label="New password"
              description="Password must include at least one letter, number and special character"
              placeholder="New password"
              {...form.getInputProps('newPassword')}
            />
          </Stack>
          <Group justify="space-between" mt="xl">
            <Button size="md" disabled={form.isSubmitting} type="submit">
              Update password
            </Button>
          </Group>
        </Section>
      </>
    )}
  </FormBase>
);

export default ChangePasswordForm;
