import {
  Box,
  Container,
  Grid,
  Stack,
  Text,
  UnstyledButton,
  rem,
  useMantineTheme,
} from '@mantine/core';
import Section from '../../../layout/section/Section';
import { useMediaQuery } from '@mantine/hooks';
import { useState, useRef } from 'react';
import classes from './Features02.module.css';
import { getIcon } from '../../../utils';
import SectionTitle from '../../../layout/section/SectionTitle';

type Features02Props = {
  title: string;
  description: string;
  tabContent: {
    content: any;
    iconHandle: string;
    name: string;
    description: string;
  }[];
};

const Features02 = ({ title, description, tabContent }: Features02Props) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const animationTimeout = useRef<number>();
  const [active, setActive] = useState(0);
  const theme = useMantineTheme();
  const controlSize = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)
    ? 60
    : 180;

  const handleActiveChange = (index: number) => {
    setActive(index);
    if (index !== active) {
      setShouldAnimate(true);
      window.clearTimeout(animationTimeout.current);
      animationTimeout.current = window.setTimeout(
        () => setShouldAnimate(false),
        500
      );
    }
  };

  const controls = tabContent.map((item, index) => {
    let Icon = () => null;
    if (item.iconHandle) {
      // @ts-ignore
      Icon = getIcon(item.iconHandle);
    }

    return (
      <UnstyledButton
        key={item.name}
        onClick={() => handleActiveChange(index)}
        data-active={index === active || undefined}
        className={classes.tab}
      >
        <Stack className={classes.tabInner}>
          {/** @ts-ignore */}
          <Icon stroke={1.5} className={classes.tabIcon} />
          <div>
            <Text className={classes.tabTitle}>{item.name}</Text>
            <Text c="dimmed" size="sm" className={classes.tabDescription}>
              {item.description}
            </Text>
          </div>
        </Stack>
      </UnstyledButton>
    );
  });

  const ActiveDemo = tabContent[active].content;

  return (
    <Section>
      <Container>
        <SectionTitle title={title} description={description} />
      </Container>
      <Container>
        <Grid gutter={0}>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <div className={classes.controls}>
              <Box
                className={classes.controlsIndicator}
                style={{
                  height: rem(controlSize),
                  transform: `translateY(${rem(controlSize * active)})`,
                }}
              />
              {controls}
            </div>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <div
              className={classes.demo}
              data-should-animate={shouldAnimate || undefined}
            >
              {/* <ActiveDemo /> */}
              {tabContent[active].content}
            </div>
          </Grid.Col>
        </Grid>
      </Container>
    </Section>
  );
};

export default Features02;
