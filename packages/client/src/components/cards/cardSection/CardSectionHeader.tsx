import { Group, Text, Stack } from '@mantine/core';
import { ReactElement } from 'react';

type CardSectionHeaderProps = {
  title: string;
  subline?: string;
  action?: ReactElement;
};

const CardSectionHeader = ({
  title,
  subline,
  action,
}: CardSectionHeaderProps) => (
  <Group justify="space-between" pb="xs" align="center">
    <Stack gap={0}>
      <Text fz="md" fw={600}>
        {title}
      </Text>
      {subline && (
        <Text fz="sm" c="dimmed">
          {subline}
        </Text>
      )}
    </Stack>
    {action}
  </Group>
);

export default CardSectionHeader;
