import { useMutation } from '@apollo/client';
import { Button, Space, Text } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { MUTATION_DELETE_ACCOUNT } from '../../../../api/mutations';
import SectionHeader from '../../../../components/page/SectionHeader';
import useAuthContext from '../../../../hooks/useAuthContext';
import { NotificationType, showNotification } from '../../../../utils/utils';

const AccountPage = () => {
  const { signOut, getUserDetails } = useAuthContext();

  const [deleteAccountMutation] = useMutation(MUTATION_DELETE_ACCOUNT);

  const accountId = getUserDetails()?.account;

  const handleConfirm = async () => {
    try {
      await deleteAccountMutation({
        variables: {
          id: accountId,
        },
      });
      signOut();
    } catch (e) {
      showNotification({
        notificationType: NotificationType.ERROR,
        title: 'Something went wrong:',
        error: e,
      });
    }
  };

  const onDelete = () => {
    openConfirmModal({
      title: 'Delete Account',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this account? All data, team members
          and projects will be permanently removed.
        </Text>
      ),
      labels: { confirm: 'Delete Account', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => handleConfirm(),
    });
  };

  return (
    <>
      <SectionHeader title="Account" description="Delete your account here" />
      <Space h="xl" />
      <Button size="md" color="red" onClick={() => onDelete()}>
        Delete account
      </Button>
    </>
  );
};

export default AccountPage;
