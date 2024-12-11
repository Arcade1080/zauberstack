import { Space } from '@mantine/core';
import SectionHeader from '../../../../components/page/SectionHeader';
import { NotificationType, showNotification } from '../../../../utils/utils';
import ProfileForm from './ProfileForm';

const ProfilePage = () => (
  <>
    <SectionHeader
      title="Profile"
      description="Update your profile information"
    />
    <Space h="xl" />
    <ProfileForm
      onSubmit={() => {
        showNotification({
          notificationType: NotificationType.SUCCESS,
          title: 'Profile updated',
        });
      }}
    />
  </>
);

export default ProfilePage;
