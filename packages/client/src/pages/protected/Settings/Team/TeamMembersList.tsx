import { ActionIcon, Badge, Group, Stack, Table } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import UserDisplay from '../../../../components/user/UserDisplay';
import useAuthContext from '../../../../hooks/useAuthContext';
import DateService from '../../../../utils/TimeService';
import { formatUserRole } from '../../../../utils/utils';

interface TeamMembersListProps {
  members: any;
  onDeleteTeamMember: any;
}

const TeamMembersList = ({
  members,
  onDeleteTeamMember,
}: TeamMembersListProps) => {
  const { getUserDetails } = useAuthContext();
  const userDetails = getUserDetails();
  if (!members) {
    return null;
  }

  const sortedMembers = [...members];
  sortedMembers.sort((a: any, b: any) => {
    if (a.isAccountOwner && !b.isAccountOwner) {
      return -1;
    }
    if (!a.isAccountOwner && b.isAccountOwner) {
      return 1;
    }
    return 0;
  });

  const ths = (
    <Table.Tr>
      <Table.Th> Email</Table.Th>
      <Table.Th>Role</Table.Th>
      <Table.Th>Member since</Table.Th>
      <Table.Th></Table.Th>
    </Table.Tr>
  );

  const rows = sortedMembers.map((member: any) => (
    <Table.Tr key={member.email}>
      <Table.Td width={300}>
        <Stack gap="xs">
          <UserDisplay
            avatar={member.avatar}
            firstline={
              member.lastname &&
              member.firstname &&
              `${member.firstname} ${member.lastname}`
            }
            subline={member.email}
          />
          <Group gap="xs" justify="flex-start">
            {member.isAccountOwner && (
              <Badge size="sm" variant="default">
                Owner
              </Badge>
            )}
            {member.id === userDetails?.id && (
              <Badge color="grape" variant="light" size="sm">
                You
              </Badge>
            )}
          </Group>
        </Stack>
      </Table.Td>
      <Table.Td>{member.role && formatUserRole(member.role.name)}</Table.Td>
      <Table.Td>
        {DateService.getReadableDateTimeInNearPast(member.createdAt)}
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
          {!member.isAccountOwner && member.id !== userDetails?.id && (
            <ActionIcon
              variant="subtle"
              disabled={member.isAccountOwner}
              onClick={() => onDeleteTeamMember(member.id)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          )}
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table captionSide="bottom">
      <Table.Thead>{ths}</Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
};

export default TeamMembersList;
