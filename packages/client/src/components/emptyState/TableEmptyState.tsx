import { Box, Stack, Title, Text } from '@mantine/core';
import classes from './TableEmptyState.module.css';

type TableEmptyStateProps = {
  title: string;
  subline: string;
  callToAction?: React.ReactNode;
};

const TableEmptyState = ({
  title,
  subline,
  callToAction,
}: TableEmptyStateProps) => (
  <Box className={classes.container}>
    <Stack align="center" gap="sm">
      <Text fz="40">¯\_(ツ)_/¯</Text>
      <Stack gap="sm" align="center">
        <Title size="h3">{title}</Title>
        <Text c="dimmed" size="md">
          {subline}
        </Text>
        {callToAction}
      </Stack>
    </Stack>
  </Box>
);

export default TableEmptyState;
