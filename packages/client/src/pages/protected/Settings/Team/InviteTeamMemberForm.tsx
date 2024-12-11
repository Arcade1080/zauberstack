import {
  ActionIcon,
  Button,
  Group,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';

import * as Yup from 'yup';
import FormBase, { FORM_MODE } from '../../../../components/forms/FormBase';
import { useInviteTeamMemberMutation } from '../../../../hooks/useInviteTeamMemberMutation';

const inviteeSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email address must be valid')
    .required('Email is required'),
  role: Yup.string().oneOf(['Admin', 'Author']).required(),
});

const validationSchema = Yup.object().shape({
  invitees: Yup.array().of(inviteeSchema),
});

type InviteTeamMemberFormProps = {
  entityId?: string;
  onSubmit: (values: any) => void;
};

const InviteTeamMemberForm = ({
  entityId,
  onSubmit,
}: InviteTeamMemberFormProps) => (
  <FormBase
    onSubmit={onSubmit}
    submitAction={useInviteTeamMemberMutation}
    entityId={entityId}
    entityKey="me"
    mode={FORM_MODE.CREATE}
    validationSchema={validationSchema}
    initialValues={{
      invitees: [
        {
          email: 'john@example.com',
          role: 'Author',
        },
      ],
    }}
  >
    {(form: any) => {
      const rows = form.values?.invitees?.map((_invitee: any, index: any) => (
        <Group
          pos="relative"
          gap="xs"
          justify="space-between"
          align="center"
          key={index}
        >
          <Group gap="sm">
            <TextInput
              grow
              label="Email"
              size="md"
              type="email"
              placeholder="Enter email address"
              {...form.getInputProps(`invitees.${index}.email`)}
            />
            <Select
              label="Role"
              w={135}
              size="md"
              data={['Author', 'Admin']}
              placeholder="Select role"
              {...form.getInputProps(`invitees.${index}.role`)}
            />
          </Group>
          <ActionIcon
            variant="subtle"
            mt={24}
            size="lg"
            disabled={form.values.invitees.length === 1}
            onClick={() => form.removeListItem('invitees', index)}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      ));
      return (
        <>
          <Stack gap="sm">
            {rows}
            <Group justify="space-between" mt="md">
              <Button
                size="md"
                variant="subtle"
                leftSection={<IconPlus size="1rem" />}
                onClick={() =>
                  form.insertListItem('invitees', {
                    email: '',
                    role: 'User',
                  })
                }
              >
                Add more
              </Button>
              <Button size="md" type="submit">
                Send invitations
              </Button>
            </Group>
          </Stack>
        </>
      );
    }}
  </FormBase>
);

export default InviteTeamMemberForm;
