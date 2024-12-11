import { useMutation, useQuery } from '@apollo/client';
import {
  Box,
  Button,
  Drawer,
  Loader,
  LoadingOverlay,
  Space,
  Text,
} from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { IconUserPlus } from '@tabler/icons-react';
import { useState } from 'react';
import {
  MUTATION_DELETE_INVITATION,
  MUTATION_DELETE_TEAM_MEMBER,
} from '../../../../api/mutations';
import { QUERY_TEAM_MEMBERS_AND_INVITATIONS } from '../../../../api/queries';
import ErrorWrangler from '../../../../components/common/ErrorWrangler';
import Section from '../../../../components/page/Section';
import SectionHeader from '../../../../components/page/SectionHeader';
import { NotificationType, showNotification } from '../../../../utils/utils';
import InviteTeamMemberForm from './InviteTeamMemberForm';
import PendingInvitationsList from './PendingInvitationsList';
import TeamMembersList from './TeamMembersList';

const TeamPage = () => {
  const [opened, setOpened] = useState(false);

  const [deleteInvitationMutation, { loading: deletingInvitation }] =
    useMutation(MUTATION_DELETE_INVITATION, {
      refetchQueries: [{ query: QUERY_TEAM_MEMBERS_AND_INVITATIONS }],
    });

  const [deleteMemberMutation, { loading: deletingMember }] = useMutation(
    MUTATION_DELETE_TEAM_MEMBER,
    {
      refetchQueries: [{ query: QUERY_TEAM_MEMBERS_AND_INVITATIONS }],
    },
  );

  const { loading, error, data, refetch } = useQuery(
    QUERY_TEAM_MEMBERS_AND_INVITATIONS,
    {},
  );

  const onDeleteInvitation = (invitationId: string) => {
    openConfirmModal({
      title: 'Revoke invitation',
      centered: true,
      children: (
        <Text size="sm">Are you sure you want to revoke this invitation?</Text>
      ),
      labels: { confirm: 'Revoke invitation', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => confirmDeletionOfInvitation(invitationId),
    });
  };

  const confirmDeletionOfInvitation = (invitationId: any) => {
    deleteInvitationMutation({
      variables: {
        id: invitationId,
      },
    })
      .then(({ data: deletedInvitationData }) => {
        showNotification({
          notificationType: NotificationType.SUCCESS,
          title: `Revoked invitation of ${deletedInvitationData.deleteInvitation.email}`,
        });
      })
      .catch((e) => {
        showNotification({
          notificationType: NotificationType.ERROR,
          title: 'Something went wrong:',
          error: e,
        });
      });
  };

  const onDeleteTeamMember = (memberId: string) => {
    openConfirmModal({
      title: 'Delete team member',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this member of your team?
        </Text>
      ),
      labels: { confirm: 'Delete team member', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => confirmDeletionOfTeamMember(memberId),
    });
  };

  const confirmDeletionOfTeamMember = (memberId: any) => {
    deleteMemberMutation({
      variables: {
        id: memberId,
      },
    })
      .then(() => {
        showNotification({
          notificationType: NotificationType.SUCCESS,
          title: 'Deleted user.',
        });
      })
      .catch((e) => {
        showNotification({
          notificationType: NotificationType.ERROR,
          title: 'Something went wrong:',
          error: e,
        });
      });
  };

  const onSuccess = () => {
    refetch();
    setOpened(false);
    showNotification({
      notificationType: NotificationType.SUCCESS,
      title: 'User invited!',
    });
  };

  return (
    <>
      <ErrorWrangler error={error} />
      <SectionHeader
        title="Team management"
        description="Manage your team members and invite new users."
        action={
          <Button
            leftSection={<IconUserPlus />}
            size="md"
            onClick={() => setOpened(true)}
          >
            Invite more users
          </Button>
        }
      />

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Invite users"
        padding="lg"
        size="md"
        position="right"
      >
        <InviteTeamMemberForm onSubmit={onSuccess} />
      </Drawer>
      <Space h="xl" />

      <Box pos="relative">
        <LoadingOverlay
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 1 }}
        />
        <Section
          heading="Team members"
          description="Your current team members are listed here."
          colConfig={{
            base: 12,
            md: 4,
          }}
        >
          {deletingMember ? (
            <Loader />
          ) : (
            <TeamMembersList
              onDeleteTeamMember={onDeleteTeamMember}
              members={data?.getMembers}
            />
          )}
        </Section>
        <Space h="xl" />
        <Section
          heading="Pending invitations"
          description="Invited users are listed here."
          colConfig={{
            base: 12,
            md: 4,
          }}
        >
          {deletingInvitation ? (
            <Loader />
          ) : (
            <PendingInvitationsList
              onDeleteInvitation={onDeleteInvitation}
              members={data?.getInvitations}
            />
          )}
        </Section>
      </Box>
    </>
  );
};

export default TeamPage;
