import { Paper, Stack, useMantineTheme } from '@mantine/core';
import { ReactElement } from 'react';
import CardSectionHeader from './CardSectionHeader';

type CardListProps = {
  title: string;
  subline?: string;
  action?: ReactElement;
  children: ReactElement;
};

// @ts-ignore
const CardSection = ({ title, subline, action, children }: CardListProps) => {
  const theme = useMantineTheme();
  return (
    <Paper withBorder p="lg" radius={theme.defaultRadius}>
      <CardSectionHeader title={title} subline={subline} action={action} />
      <Stack gap="md" pt="xs">
        {children}
      </Stack>
    </Paper>
  );
};

export default CardSection;
