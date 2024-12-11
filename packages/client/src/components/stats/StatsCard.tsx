import {
  Group,
  Paper,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import classes from './StatsCard.module.css';

type StatsCardProps = {
  title: string;
  number: number;
  subline?: string;
  Icon: React.ComponentType | React.ReactElement; // This can be a React component type or a React element
};

// @ts-ignore
const StatsCard = ({ title, number, subline, Icon }: StatsCardProps) => {
  const theme = useMantineTheme();
  return (
    <Paper withBorder p="lg" radius={theme.defaultRadius}>
      <Stack gap="4 px">
        <Group justify="space-between">
          <Text fz={15} c="dimmed" className={classes.title}>
            {title}
          </Text>
          {/* @ts-ignore */}
          <Icon className={classes.icon} size={22} stroke={1.5} />
        </Group>
        <Stack gap="0">
          <Title size="h2">{number}</Title>
          {subline && (
            <Text fz="xs" c="dimmed">
              {subline}
            </Text>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default StatsCard;
