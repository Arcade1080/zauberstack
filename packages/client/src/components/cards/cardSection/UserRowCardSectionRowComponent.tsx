import { Group, Stack, Text } from '@mantine/core';
import UserDisplay from '../../user/UserDisplay';

type UserCardSectionRowComponentProps = {
  firstname?: string;
  lastname?: string;
  email?: string;
  avatar?: any;
  role: any;
};

const roleMapping = {
  author: 'Author',
  admin: 'Admin',
};

const UserCardSectionRowComponent = ({
  firstname,
  lastname,
  email,
  avatar,
  role,
}: UserCardSectionRowComponentProps) => (
  <Group justify="space-between">
    <Stack>
      <UserDisplay
        avatar={avatar}
        firstline={firstname && lastname && `${firstname} ${lastname}`}
        subline={email}
      />
    </Stack>
    <Text c="dimmed" fz="sm">
      {roleMapping[role.name as keyof typeof roleMapping]}
    </Text>
  </Group>
);

export default UserCardSectionRowComponent;
