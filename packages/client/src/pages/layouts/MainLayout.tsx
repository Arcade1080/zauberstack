import { AppShell, Box, Burger, Container, Group, Space } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet } from 'react-router-dom';
import Logo from '../../components/logo/Logo';
import { Navbar } from '../../components/navigation/navbar/Navbar';
import { Paths } from '../../routes/paths';
import { FallbackRender } from './FallbackRender';
import { ThemeSwitch } from '../../components/themeSwitch/ThemeSwitch';

const MainLayout = () => {
  // = "mantine-breakpoint-xs": "36em"
  const isDesktop = useMediaQuery('(min-width: 36em)');
  const [isCondensed, setIsCondensed] = useState(false);
  const [opened, { toggle, close }] = useDisclosure(false);
  return (
    <AppShell
      header={{
        height: 60,
        collapsed: isDesktop,
      }}
      navbar={{
        // 16px left padding navbar container, 76 navbar width as in  specs
        width: isCondensed ? 92 : 320,
        breakpoint: 'xs',
        collapsed: {
          mobile: !opened,
        },
      }}
      padding="lg"
    >
      <ErrorBoundary fallbackRender={FallbackRender}>
        <AppShell.Header>
          <Container h="100%">
            <Group justify="space-between" align="center" h="100%">
              <Group gap="xs" h="100%" justify="left" align="center">
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="sm"
                  size="sm"
                />
                <Logo link={Paths.Home} />
              </Group>
              <ThemeSwitch />
            </Group>
          </Container>
        </AppShell.Header>

        <AppShell.Navbar
          pl="md"
          pt="md"
          pb="md"
          pr={!isDesktop ? 'md' : 0}
          withBorder={false}
          style={{
            transition:
              'width var(--app-shell-transition-duration) var(--app-shell-transition-timing-function)',
          }}
        >
          <Navbar
            isMobile={!isDesktop}
            isCondensed={!!(isDesktop && isCondensed)}
            setIsCondensed={setIsCondensed}
            onLinkClick={() => {
              if (!isDesktop) {
                close();
              }
            }}
          />
        </AppShell.Navbar>
        <AppShell.Main>
          <Box
            visibleFrom="xs"
            pos="fixed"
            bottom={32}
            style={{ zIndex: 1000 }}
            right={32}
          >
            <ThemeSwitch />
          </Box>
          <Outlet />
          <Space h="xl" />
          <Space h="xl" />
        </AppShell.Main>
      </ErrorBoundary>
    </AppShell>
  );
};

export default MainLayout;
