import { Avatar, Group, Stack, Text } from '@mantine/core';
import { getMediaUrl } from '../../utils/utils';

type UserDisplayProps = {
  firstline?: string | React.ReactNode;
  subline?: string | React.ReactNode;
  avatar?: string;
};

const UserDisplay = ({ firstline, subline, avatar }: UserDisplayProps) => (
  <Group wrap="nowrap" gap="sm">
    <Avatar src={getMediaUrl(avatar)} radius="xl" />
    <Stack gap={0}>
      {firstline && <Text size="sm">{firstline}</Text>}
      <Text lineClamp={1} c="dimmed" size="sm">
        {subline}
      </Text>
    </Stack>
  </Group>
);

export default UserDisplay;
