import { Grid, Text } from '@mantine/core';
import { ReactNode } from 'react';

interface SectionProps {
  heading?: string;
  description?: string;
  children?: ReactNode;
  colConfig?: any;
}

const Section = ({
  heading,
  description,
  children,
  colConfig,
}: SectionProps) => (
  <Grid gutter="xl" align="flex-start">
    <Grid.Col
      span={
        colConfig || {
          base: 12,
          xs: 4,
        }
      }
    >
      <Text fw={600} fz="md">
        {heading}
      </Text>
      <Text c="dimmed" fw={400} fz="sm">
        {description}
      </Text>
    </Grid.Col>
    <Grid.Col span="auto">{children} </Grid.Col>
  </Grid>
);

export default Section;
