import { Box, Group, Text } from '@mantine/core';
import { ReactElement } from 'react';
import UserDisplay from '../../user/UserDisplay';

type UserActivityCardSectionRowProps = {
  name: string;
  activity: ReactElement;
  avatar: string;
  time: string;
};

const UserActivityCardSectionRow = ({
  name,
  activity,
  avatar,
  time,
}: UserActivityCardSectionRowProps) => (
  <Group wrap="nowrap" justify="space-between">
    <Box maw="72%">
      <UserDisplay avatar={avatar} firstline={name} subline={activity} />
    </Box>
    <Text c="dimmed" fz="xs">
      {time}
    </Text>
  </Group>
);

export default UserActivityCardSectionRow;
