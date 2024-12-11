import { Space } from '@mantine/core';
import SectionHeader from '../../../../components/page/SectionHeader';
import ChangePasswordForm from './ChangePasswordForm';
import { NotificationType, showNotification } from '../../../../utils/utils';

const ChangePasswordPage = () => (
  <>
    <SectionHeader title="Password" description="Update your password here." />
    <Space h="xl" />
    <ChangePasswordForm
      onSubmit={() => {
        showNotification({
          notificationType: NotificationType.SUCCESS,
          title: 'Password changed!',
        });
      }}
    />
  </>
);

export default ChangePasswordPage;
