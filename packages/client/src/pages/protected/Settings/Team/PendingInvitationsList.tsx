import { ActionIcon, Box, Group, Table, Text } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import DateService from '../../../../utils/TimeService';
import { formatUserRole } from '../../../../utils/utils';

interface PendingInvitationsListProps {
  members: {
    email: string;
    role: string;
    createdAt: string;
    id: string;
  }[];
  onDeleteInvitation: (id: string) => void;
}

const PendingInvitationsList = ({
  members: invitations,
  onDeleteInvitation,
}: PendingInvitationsListProps) => {
  if (!invitations) {
    return null;
  }
  const ths = (
    <Table.Tr>
      <Table.Th> Email</Table.Th>
      <Table.Th>Role</Table.Th>
      <Table.Th>Sent</Table.Th>
      <Table.Th></Table.Th>
    </Table.Tr>
  );

  const rows = invitations.map((invitation: any) => (
    <Table.Tr key={invitation.email}>
      <Table.Td width={300}>{invitation.email}</Table.Td>
      <Table.Td> {formatUserRole(invitation.role)}</Table.Td>
      <Table.Td>
        {DateService.getReadableDateTimeInNearPast(invitation.createdAt)}
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
          <ActionIcon
            onClick={() => onDeleteInvitation(invitation.id)}
            variant="subtle"
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table captionSide="bottom">
      <Table.Thead>{ths}</Table.Thead>
      <Table.Tbody>
        {rows.length ? (
          rows
        ) : (
          <Box p={8}>
            <Text c="grey" fw={400} fz="sm">
              No invitations yet.
            </Text>
          </Box>
        )}
      </Table.Tbody>
    </Table>
  );
};

export default PendingInvitationsList;
