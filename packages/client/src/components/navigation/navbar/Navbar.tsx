import {
  Box,
  Divider,
  Menu,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import {
  IconChevronsLeft,
  IconChevronsRight,
  IconDashboard,
  IconListCheck,
  IconLogout,
  IconSettings,
  IconTags,
} from '@tabler/icons-react';
import cx from 'clsx';
import { NavLink } from 'react-router-dom';
import packageJson from '../../../../package.json';
import useAuthContext from '../../../hooks/useAuthContext';
import { Paths } from '../../../routes/paths';
import { checkPermissions } from '../../common/PermissionGate';
import UserButton from '../../common/userButton/UserButton';
import Logo from '../../logo/Logo';
import classes from './Navbar.module.css';

const navLinks = [
  {
    link: Paths.Home,
    label: 'Dashboard',
    icon: IconDashboard,
  },
  {
    link: Paths.Tasks,
    label: 'Tasks',
    icon: IconListCheck,
    requiredPermissions: [
      'read-tasks',
      'create-tasks',
      'update-tasks',
      'delete-tasks',
    ],
  },
  {
    link: Paths.Tags,
    label: 'Tags',
    icon: IconTags,
    requiredPermissions: [
      'read-tags',
      'create-tags',
      'update-tags',
      'delete-tags',
    ],
  },
];

type NavbarProps = {
  isCondensed: boolean;
  isMobile: boolean;
  onLinkClick: () => void;
  setIsCondensed: (value: boolean) => void;
};

export function Navbar({
  isMobile,
  onLinkClick,
  isCondensed,
  setIsCondensed,
}: NavbarProps) {
  const { signOut, getUserDetails } = useAuthContext();
  const userDetails = getUserDetails();

  const links = navLinks.map((item, index) => {
    if (!userDetails) {
      return null;
    }

    if (item.requiredPermissions) {
      const hasPermissions = checkPermissions(
        item.requiredPermissions,
        userDetails.permissions,
      );

      if (!hasPermissions) {
        return null;
      }
    }
    return (
      <Tooltip
        key={index}
        position="right"
        disabled={!isCondensed}
        label={item.label}
      >
        <NavLink
          onClick={onLinkClick}
          className={({ isActive }) =>
            isActive ? `${classes.link} ${classes.linkActive}` : classes.link
          }
          to={item.link}
          key={item.label}
        >
          <item.icon className={classes.linkIcon} stroke={1.5} />
          <span className={classes.linkLabel}>{item.label}</span>
        </NavLink>
      </Tooltip>
    );
  });

  return (
    <Stack
      className={`${classes.navbar} ${isCondensed ? classes.isCondensed : ''} ${
        isMobile ? classes.isMobile : ''
      }`}
      justify="space-between"
      align={`${isCondensed ? 'center' : 'left'}`}
    >
      <Stack justify="space-between" gap={`${isCondensed ? 'lg' : 'xl'}`}>
        <Box className={classes.header}>
          <Logo link={Paths.Home} />
          <UnstyledButton
            onClick={() => setIsCondensed(!isCondensed)}
            variant="subtle"
            aria-label="Settings"
            className={cx(classes.link, classes.menuToggle)}
          >
            {isCondensed ? (
              <IconChevronsRight className={classes.linkIcon} stroke={1.5} />
            ) : (
              <IconChevronsLeft className={classes.linkIcon} stroke={1.5} />
            )}
          </UnstyledButton>
        </Box>
        <Stack gap={2} justify="space-between">
          {links}
        </Stack>
      </Stack>

      <Stack>
        <Tooltip position="right" disabled={!isCondensed} label="Settings">
          <NavLink
            onClick={onLinkClick}
            className={({ isActive }) =>
              isActive ? `${classes.link} ${classes.linkActive}` : classes.link
            }
            to={Paths.Settings}
            key="Settings"
          >
            <IconSettings className={classes.linkIcon} stroke={1.5} />
            <span className={classes.linkLabel}>Settings</span>
          </NavLink>
        </Tooltip>
        <Divider />
        <Menu withArrow>
          <Menu.Target>
            <Box maw={200}>
              <UserButton
                image={userDetails?.avatar || ''}
                condensed={isCondensed}
                plan={
                  /*  @ts-ignore */
                  userDetails?.plan ? `${userDetails?.plan} plan` : 'Free plan'
                }
                email={userDetails?.email || ''}
              />
            </Box>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={
                <IconLogout className={classes.linkIcon} stroke={1.5} />
              }
              onClick={(event) => {
                event.preventDefault();
                signOut();
              }}
            >
              Sign out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        {!isCondensed && (
          <Text
            pos="absolute"
            className={classes.versionNumber}
            right={isMobile ? 32 : 16}
            bottom={32}
            fz="xs"
          >
            v{packageJson.version}
          </Text>
        )}
      </Stack>
    </Stack>
  );
}
