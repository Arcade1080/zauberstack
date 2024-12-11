import { Divider, Group, Stack, Text, Title } from '@mantine/core';

interface SectionHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode | null;
  hasDivider?: boolean;
}

const SectionHeader = ({
  title,
  description,
  action,
  hasDivider = true,
}: SectionHeaderProps) => (
  <>
    <Group py="xl" gap="lg" justify="space-between">
      <Stack gap="0">
        <Title size="h3">{title}</Title>
        <Text size="md" c="dimmed">
          {description}
        </Text>
      </Stack>
      {action}
    </Group>
    {hasDivider && <Divider size="xs" />}
  </>
);

export default SectionHeader;
