import {
  Container,
  Group,
  Image,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import NextImage from 'next/image';
import Section from '../../../layout/section/Section';

type Logo = {
  alt: string;
  src: string;
};

type Logos = Logo[];

type Logocloud01Props = {
  title: string;
  logos: Logos;
};

const Logocloud01 = ({ title, logos }: Logocloud01Props) => {
  const theme = useMantineTheme();
  const isDesktop = useMediaQuery('(min-width: 36em)');

  return (
    <Section bg={theme.colors.gray[0]}>
      <Container>
        <Stack gap={'xl'}>
          <Text ta="center" size="md">
            {title}
          </Text>
          <Group gap={'xl'} justify={isDesktop ? 'space-between' : 'center'}>
            {logos.map((logo, index) => (
              <Image
                width={150}
                height={40}
                key={index}
                component={NextImage}
                src={logo.src}
                alt={logo.alt}
              />
            ))}
          </Group>
        </Stack>
      </Container>
    </Section>
  );
};

export default Logocloud01;
