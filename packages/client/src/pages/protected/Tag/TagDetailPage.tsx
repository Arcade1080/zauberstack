import { useMutation, useQuery } from '@apollo/client';
import { Box, Drawer, LoadingOverlay, Text } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MUTATION_DELETE_TAG } from '../../../api/mutations';
import { QUERY_GET_TAGS, QUERY_GET_TAG_DETAIL } from '../../../api/queries';
import { FORM_MODE } from '../../../components/forms/FormBase';
import Page from '../../../components/page/Page';
import { Paths } from '../../../routes/paths';
import { NotificationType, showNotification } from '../../../utils/utils';
import TagForm from './TagForm';

const TagDetailPage = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [opened, setOpened] = useState(false);

  const { id: tagId } = params || {};

  const { loading, error, data, refetch } = useQuery(QUERY_GET_TAG_DETAIL, {
    variables: {
      id: params.id,
    },
  });

  const [deleteMutation, { loading: deleting }] = useMutation(
    MUTATION_DELETE_TAG,
    {
      refetchQueries: [{ query: QUERY_GET_TAGS }],
    },
  );

  const handleConfirm = () => {
    deleteMutation({
      variables: {
        id: tagId,
      },
    })
      .then(() => {
        navigate('/tags', { replace: true });
        showNotification({
          notificationType: NotificationType.SUCCESS,
          title: 'Deleted tag!',
          message: 'This was nice! We should do this again!',
        });
      })
      .catch((e) => {
        showNotification({
          notificationType: NotificationType.ERROR,
          title: 'There was an error deleting this task:',
          error: e,
        });
      });
  };

  const onDelete = () => {
    openConfirmModal({
      title: 'Delete Tag',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this tag? This action is destructive
          and you will have to contact support to restore your data.
        </Text>
      ),
      labels: { confirm: 'Delete tag', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => handleConfirm(),
    });
  };

  const onSuccess = () => {
    refetch();
    setOpened(false);

    showNotification({
      notificationType: NotificationType.SUCCESS,
      title: 'Updated tag!',
      message: 'This was nice! We should do this again!',
    });
  };

  if (loading) {
    return (
      <Box h="100%" pos="relative">
        <LoadingOverlay visible />
      </Box>
    );
  }
  if (error) return <div>`Error! ${error.message}`</div>;

  return (
    <>
      <Page
        title={data.tag.name}
        backLink={{
          label: 'Tags',
          to: Paths.Tags,
        }}
        primaryAction={{
          content: 'Edit tag',
          onClick: () => setOpened(true),
          loading,
        }}
        secondaryActions={[
          {
            content: 'Delete',
            destructive: true,
            onClick: () => onDelete(),
            loading: loading || deleting,
          },
        ]}
      >
        <Drawer
          opened={opened}
          onClose={() => setOpened(false)}
          title="Edit tag"
          padding="md"
          size="sm"
          position="right"
        >
          <TagForm
            mode={FORM_MODE.EDIT}
            entityId={tagId}
            onSubmit={onSuccess}
          />
        </Drawer>
      </Page>
    </>
  );
};

export default TagDetailPage;
