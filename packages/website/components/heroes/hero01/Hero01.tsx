import {
  Box,
  Button,
  Container,
  Group,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import Section from "../../../layout/section/Section";
import { getIcon } from "../../../utils";
import classes from "./Hero01.module.css";

type Hero01Props = {
  title: string;
  id: string;
  eyebrow: string;
  description: string;
  cta:
    | { label: string; link: string; variant: string; iconHandle?: string }
    | {
        label: string;
        link: string;
        variant: string;
        iconHandle?: string;
      }[];
  media: React.ReactNode;
};

const Hero01 = ({
  title,
  eyebrow,
  description,
  cta,
  media,
  id,
}: Hero01Props) => {
  const isDesktop = useMediaQuery("(min-width: 36em)");

  const ctaConfig = Array.isArray(cta) ? cta : [cta];

  const ctas = ctaConfig.map((config) => {
    let Icon = () => null;
    if (config.iconHandle) {
      // @ts-ignore
      Icon = getIcon(config.iconHandle);
    }

    return (
      <Button
        component={Link}
        href={config.link}
        key={config.label}
        size={isDesktop ? "lg" : "md"}
        fullWidth={!isDesktop}
        variant={config.variant}
        leftSection={<Icon />}
      >
        {config.label}
      </Button>
    );
  });

  return (
    <Section id={id}>
      <Container>
        <Box className={classes.contentWrapper}>
          {media}
          <Text className={classes.eyebrow}>{eyebrow}</Text>
          <Space h="lg" />
          <Stack gap="xl">
            <Title className={classes.title}>{title}</Title>
            <Text className={classes.description}>{description}</Text>
            <Group justify="center" gap={isDesktop ? "lg" : "sm"}>
              {ctas}
            </Group>
          </Stack>
        </Box>
      </Container>
    </Section>
  );
};

export default Hero01;
