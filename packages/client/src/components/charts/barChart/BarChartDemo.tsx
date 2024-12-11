import {
  Box,
  Group,
  Paper,
  Stack,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { Bar, BarChart, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  {
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
const BarChartDemo = () => {
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
                  Non-billable hours
                </Text>
                <Text c={theme.colors.gray[6]}>{`${payload[1].value}`}</Text>
              </Stack>
              <Stack gap="0">
                <Text fz="xs" c="dimmed">
                  Billable hours
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
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
          }}
        >
          <Tooltip content={<CustomTooltip />} />

          <Bar
            dataKey="pv"
            stackId="a"
            fill={colorScheme === 'light' ? theme.colors.gray[9] : theme.white}
          />
          <Bar
            dataKey="uv"
            stackId="a"
            fill={
              colorScheme === 'light'
                ? theme.colors.gray[2]
                : theme.colors.gray[8]
            }
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BarChartDemo;
