import {
  Container,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  useMantineTheme,
} from '@mantine/core';
import Section from '../../../layout/section/Section';
import SectionTitle from '../../../layout/section/SectionTitle';
import { getIcon } from '../../../utils';

type Features03Props = {
  title: string;
  description: string;
  features?: any;
};

type FeatureProps = {
  iconHandle: string;
  title: string;
  description: string;
};

const Features03 = ({ title, description, features }: Features03Props) => {
  const theme = useMantineTheme();

  const _features = features.map((feature: any, index: any) => {
    const { iconHandle, title, description } = feature;
    const Icon = getIcon(iconHandle);
    return (
      <Stack key={index}>
        <ThemeIcon variant="light" size={40} radius={40}>
          {/* @ts-ignore */}
          <Icon />
        </ThemeIcon>

        <Text>{title}</Text>
        <Text size="sm" c="dimmed" lh={1.6}>
          {description}
        </Text>
      </Stack>
    );
  });

  return (
    <Section bg={theme.colors.gray[0]}>
      <Container>
        <SectionTitle title={title} description={description} />
      </Container>
      <Container>
        <SimpleGrid
          cols={{ base: 1, sm: 2, md: 3 }}
          spacing={{ base: 'xl', md: 50 }}
          verticalSpacing={{ base: 'xl', md: 50 }}
        >
          {_features}
        </SimpleGrid>
      </Container>
    </Section>
  );
};

export default Features03;
