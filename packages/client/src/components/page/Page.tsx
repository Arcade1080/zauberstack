import {
  Anchor,
  Box,
  Button,
  Group,
  LoadingOverlay,
  Space,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

interface PrimaryActionProps {
  content: string;
  onClick: () => void;
  icon?: any;
  loading?: boolean;
  destructive?: boolean;
}

interface PageProps {
  children: React.ReactNode;
  primaryAction?: PrimaryActionProps;
  title: string;
  backLink?: any;
  showLoadingOverlay?: boolean;
  secondaryActions?: [PrimaryActionProps];
  subline?: string;
}

const Page = ({
  children,
  primaryAction,
  showLoadingOverlay,
  secondaryActions,
  title,
  backLink,
  subline,
}: PageProps) => {
  const { content, onClick, loading } = primaryAction || {};

  if (showLoadingOverlay) {
    return (
      <Box w="100%" h="100vh" pos="relative">
        <LoadingOverlay visible />
      </Box>
    );
  }

  return (
    <Box pos="relative">
      <Box>
        <Group justify="space-between">
          <Box>
            <Stack gap="sm">
              {backLink && (
                <Anchor component={Link} to={backLink.to}>
                  <Group c="dimmed" gap="xs">
                    <IconChevronLeft size={20} />
                    <Text>{backLink.label}</Text>
                  </Group>
                </Anchor>
              )}
              <Stack gap="0">
                <Title size="h2">{title}</Title>
                {subline && <Text c="dimmed">{subline}</Text>}
              </Stack>
            </Stack>
          </Box>
          <Group justify="space-between">
            {secondaryActions?.map((action, index) => (
              <Button
                variant="default"
                loading={action.loading}
                size="md"
                key={index}
                onClick={action.onClick}
                leftSection={action.icon}
              >
                {action.content}
              </Button>
            ))}
            {primaryAction && (
              <Button
                leftSection={
                  primaryAction.icon && <primaryAction.icon size={20} />
                }
                size="md"
                loading={loading}
                onClick={onClick}
              >
                {content}
              </Button>
            )}
          </Group>
        </Group>
      </Box>
      <Space h="xl" />
      <Box>{children}</Box>
    </Box>
  );
};

export default Page;
