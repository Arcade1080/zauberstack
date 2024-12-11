import {
  Divider,
  Group,
  List,
  Paper,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import { ReactElement } from 'react';

import classes from './PricingCard.module.css';

type PricingCardProps = {
  plan: string;
  price: string;
  interval: string;
  description: string;
  planStatusText?: string;
  cta?: ReactElement | null;
  featuresLabel: string;
  featuresDescription: string;
  features: any[];
  topBadge?: ReactElement | null;
};

// @ts-ignore
const PricingCard = ({
  plan,
  price,
  topBadge,
  interval,
  description,
  featuresDescription,
  featuresLabel,
  cta,
  planStatusText,
  features,
}: PricingCardProps) => {
  const theme = useMantineTheme();

  const featureListItems = features.map((feature, index) => (
    <List.Item key={index}>
      <Text>{feature.label}</Text>
    </List.Item>
  ));

  return (
    <Paper
      style={{ overflow: 'hidden', height: '100%' }}
      withBorder
      radius={theme.defaultRadius}
    >
      <Stack justify="stretch" gap="lg" p="lg">
        <Stack gap="md">
          <Stack gap="4px">
            <Group align="center" gap="xs">
              <Text size="md" fw={600}>
                {plan}
              </Text>
              {topBadge}
            </Group>
            {planStatusText && (
              <Text c="dimmed" size="xs">
                {planStatusText}
              </Text>
            )}
          </Stack>
          <Stack gap="0">
            <Group gap="xs" align="baseline">
              <Title size="h2">{price}</Title>
              <Text c="dimmed" size="md">
                per {interval}
              </Text>
            </Group>
            {description && <Text>{description}</Text>}
          </Stack>
        </Stack>
        {cta}
      </Stack>
      <Divider />
      <Stack
        style={{ height: '100%' }}
        justify="stretch"
        className={classes.featuresContainer}
        gap="lg"
        p="lg"
      >
        <Stack gap={4}>
          <Text size="md" fw={600}>
            {featuresLabel}
          </Text>
          <Text size="md" c="dimmed">
            {featuresDescription}
          </Text>
        </Stack>
        <List
          spacing="xs"
          size="md"
          center
          icon={<IconCircleCheck className={classes.listIcon} size="1.25rem" />}
        >
          {featureListItems}
        </List>
      </Stack>
    </Paper>
  );
};

export default PricingCard;
