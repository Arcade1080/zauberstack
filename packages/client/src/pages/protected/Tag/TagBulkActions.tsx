import { useMutation } from '@apollo/client';
import { Box, Button, Group, Text } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { BULK_DELETE_TAGS } from '../../../api/mutations';
import { NotificationType, showNotification } from '../../../utils/utils';
import classes from '../Task/BulkActions.module.css';

const TagBulkActions = ({ selectedRecords, onFinishedBulkDeletion }: any) => {
  const [bulkDeleteMutation] = useMutation(BULK_DELETE_TAGS);

  const onBulkDeletion = () => {
    openConfirmModal({
      title: 'Delete tags',
      centered: true,
      children: (
        <Text size="sm">Are you sure you want to delete these tags?</Text>
      ),
      labels: { confirm: 'Delete tags', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => handleBulkDeletion(selectedRecords),
    });
  };

  const handleBulkDeletion = async (selection: any) => {
    try {
      await bulkDeleteMutation({
        variables: {
          ids: selection.map((item: any) => item.id),
        },
      });

      showNotification({
        notificationType: NotificationType.SUCCESS,
        title: 'Tags successfully deleted!',
        message: 'This was nice! We should do this again!',
      });

      onFinishedBulkDeletion();
    } catch (e: any) {
      showNotification({
        notificationType: NotificationType.ERROR,
        title: 'There was an error deleting these tasks:',
        error: e,
      });
    }
  };

  if (!selectedRecords.length) return null;

  return (
    <Box className={classes.container}>
      <Group>
        <Button size="xs" variant="outline" onClick={() => onBulkDeletion()}>
          Delete
        </Button>
      </Group>
    </Box>
  );
};

export default TagBulkActions;
