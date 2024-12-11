import {
  Burger,
  Button,
  Container,
  Divider,
  Drawer,
  Group,
  ScrollArea,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import cx from "clsx";
import Link from "next/link";
import Logo from "../../logo/Logo";
import classes from "./Header01.module.css";

type Header01Props = {
  fixed?: boolean;
};

const Header01 = ({ fixed }: Header01Props) => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  return (
    <div className={classes.headerWrapper}>
      <Container className={cx(fixed && classes.isFixed)}>
        <header className={classes.header}>
          <Group justify="space-between" h="100%">
            <Link href="/#home">
              <Logo />
            </Link>
            <Group h="100%" gap={0} visibleFrom="sm">
              <Link href="/#home" className={classes.link}>
                Home
              </Link>
              <Link href="/#features" className={classes.link}>
                Features
              </Link>
              <Link href="/#pricing" className={classes.link}>
                Pricing
              </Link>
              <Link href="/#contact" className={classes.link}>
                Contact
              </Link>
            </Group>
            <Group visibleFrom="sm">
              <Button
                component={Link}
                href={
                  process.env.NEXT_PUBLIC_SIGNIN_URL ||
                  "https://app.zauberstack.com/sign-in"
                }
                variant="default"
              >
                Sign in
              </Button>
              <Button
                component={Link}
                href={
                  process.env.NEXT_PUBLIC_SIGNUP_URL ||
                  "https://app.zauberstack.com/sign-up"
                }
              >
                Sign up
              </Button>
            </Group>

            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              hiddenFrom="sm"
            />
          </Group>
        </header>

        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          size="100%"
          padding="md"
          title="Navigation"
          hiddenFrom="sm"
          zIndex={1000000}
        >
          <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
            <Divider my="sm" />

            <Link href="/#home" onClick={closeDrawer} className={classes.link}>
              Home
            </Link>
            <Link
              href="/#features"
              onClick={closeDrawer}
              className={classes.link}
            >
              Features
            </Link>
            <Link
              href="/#pricing"
              onClick={closeDrawer}
              className={classes.link}
            >
              Pricing
            </Link>
            <Link
              href="/#contact"
              onClick={closeDrawer}
              className={classes.link}
            >
              Contact
            </Link>

            <Divider my="sm" />

            <Group justify="center" grow pb="xl" px="md">
              <Button
                component={Link}
                href={process.env.NEXT_PUBLIC_SIGNIN_URL || "#"}
                variant="default"
              >
                Sign in
              </Button>
              <Button
                component={Link}
                href={process.env.NEXT_PUBLIC_SIGNUP_URL || "#"}
              >
                Sign up
              </Button>
            </Group>
          </ScrollArea>
        </Drawer>
      </Container>
    </div>
  );
};

export default Header01;
