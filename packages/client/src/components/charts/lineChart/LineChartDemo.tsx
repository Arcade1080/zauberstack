import {
  Box,
  Group,
  Paper,
  Stack,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  {
    name: 'Jan',
    2023: 4000,
    2024: 2400,
  },
  {
    name: 'Feb',
    2023: 3000,
    2024: 1398,
  },
  {
    name: 'Mar',
    2023: 2000,
    2024: 9800,
  },
  {
    name: 'Apr',
    2023: 2780,
    2024: 3908,
  },
  {
    name: 'May',
    2023: 1890,
    2024: 4800,
  },
  {
    name: 'Jun',
    2023: 2390,
    2024: 3800,
  },
  {
    name: 'Jul',
    2023: 3490,
    2024: 4300,
  },
  { name: 'Aug', 2023: 4000, 2024: 2400 },
  { name: 'Sep', 2023: 3000, 2024: 1398 },
  { name: 'Oct', 2023: 2000, 2024: 9800 },
  { name: 'Nov', 2023: 2780, 2024: 3908 },
  { name: 'Dec', 2023: 1890, 2024: 4800 },
];

const LineChartDemo = () => {
  const theme = useMantineTheme();

  const { colorScheme } = useMantineColorScheme();

  const getLabel = (label: any) => {
    switch (label) {
      case 0:
        return 'January';
      case 1:
        return 'February';
      case 2:
        return 'March';
      case 3:
        return 'April';
      case 4:
        return 'May';
      case 5:
        return 'June';
      case 6:
        return 'July';
      case 7:
        return 'August';
      case 8:
        return 'September';
      case 9:
        return 'October';
      case 10:
        return 'November';
      case 11:
        return 'December';
      default:
        return '';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper withBorder p="sm" radius={theme.defaultRadius}>
          <Stack gap="xs">
            <Text fw={600}>{getLabel(label)}</Text>
            <Group>
              <Stack gap="0">
                <Text fz="xs" c="dimmed">
                  2023
                </Text>
                <Text c={theme.colors.gray[6]}>{`${payload[1].value}`}</Text>
              </Stack>
              <Stack gap="0">
                <Text fz="xs" c="dimmed">
                  2024
                </Text>
                <Text>{`${payload[0].value}`}</Text>
              </Stack>
            </Group>
          </Stack>
        </Paper>
      );
    }
    return null;
  };
  return (
    <Box style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <Tooltip content={CustomTooltip} />
          <Line
            dot={{
              stroke:
                colorScheme === 'light' ? theme.colors.gray[9] : theme.white,
            }}
            activeDot={{
              stroke:
                colorScheme === 'light' ? theme.colors.gray[9] : theme.white,
              strokeWidth: 2,
              r: 6,
            }}
            stroke={
              colorScheme === 'light' ? theme.colors.gray[9] : theme.white
            }
            strokeWidth={2}
            type="monotone"
            dataKey="2024"
          />
          <Line
            dot={{
              stroke:
                colorScheme === 'light'
                  ? theme.colors.gray[4]
                  : theme.colors.gray[6],
              fill:
                colorScheme === 'light' ? theme.white : theme.colors.gray[6],
            }}
            activeDot={{
              fill:
                colorScheme === 'light'
                  ? theme.colors.gray[4]
                  : theme.colors.gray[6],
              stroke:
                colorScheme === 'light'
                  ? theme.colors.gray[4]
                  : theme.colors.gray[6],
            }}
            stroke={
              colorScheme === 'light'
                ? theme.colors.gray[4]
                : theme.colors.gray[6]
            }
            strokeWidth={2}
            type="monotone"
            dataKey="2023"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default LineChartDemo;
