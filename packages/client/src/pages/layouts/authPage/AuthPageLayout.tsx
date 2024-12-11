import { Box, Container, Group, Image, Space } from '@mantine/core';
import bg from '../../../assets/auth-bg.svg';
import logo from '../../../assets/logo.svg';
import classes from './AuthPageLayout.module.css';

interface AuthPageLayoutProps {
  children: React.ReactNode;
}

const AuthPageLayout = ({ children }: AuthPageLayoutProps) => (
  <Group gap={0} justify="center">
    <Box className={classes.contentWrapper}>
      <Container className={classes.content}>
        <Image src={logo} alt="Zauberstack" className={classes.logo} />
        <Space h="xl" />
        <Space h="xl" />
        {children}
      </Container>
    </Box>
    <Group
      visibleFrom="sm"
      align="center"
      justify="center"
      className={classes.imageWrapper}
    >
      <Image h="auto" maw="auto" src={bg} alt="Zauberstack" />
    </Group>
  </Group>
);

export default AuthPageLayout;
