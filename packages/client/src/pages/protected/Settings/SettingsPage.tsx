import { Tabs } from '@mantine/core';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import PermissionGate from '../../../components/common/PermissionGate';
import Page from '../../../components/page/Page';

const SettingsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const shouldRedirect = location.pathname === '/settings';

  const tabValue = location.pathname.split('/').pop();

  useEffect(() => {
    if (shouldRedirect) {
      navigate('/settings/profile');
    }
  });

  return (
    <Page title="Settings">
      <Tabs
        value={tabValue}
        onChange={(value) => navigate(`/settings/${value}`)}
      >
        <Tabs.List>
          <Tabs.Tab value="profile">Profile</Tabs.Tab>
          <Tabs.Tab value="password">Password</Tabs.Tab>

          <PermissionGate
            requiredPermissions={['read-subscriptions', 'edit-subscriptions']}
          >
            <Tabs.Tab value="subscription">Subscription</Tabs.Tab>
          </PermissionGate>
          <PermissionGate requiredPermissions={['edit-users', 'invite-users']}>
            <Tabs.Tab value="team">Team</Tabs.Tab>
          </PermissionGate>
          <PermissionGate requiredPermissions={['edit-account']}>
            <Tabs.Tab value="account">Account</Tabs.Tab>
          </PermissionGate>
        </Tabs.List>
      </Tabs>

      <Outlet />
    </Page>
  );
};

export default SettingsPage;
