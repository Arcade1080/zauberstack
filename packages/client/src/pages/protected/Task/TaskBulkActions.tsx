import { useMutation } from '@apollo/client';
import { Box, Button, Group, Popover, Stack, Text } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { IconTags } from '@tabler/icons-react';
import { useState } from 'react';
import {
  BULK_DELETE_TASKS,
  MUTATION_ADD_TAGS_TO_TASKS,
  MUTATION_CREATE_TAG,
} from '../../../api/mutations';
import { QUERY_GET_TAGS, QUERY_GET_TASKS } from '../../../api/queries';
import { ComboMultiSelect } from '../../../components/form/ComboMultiSelect';
import { NotificationType, showNotification } from '../../../utils/utils';
import classes from './BulkActions.module.css';

const TaskBulkActions = ({
  selectedRecords,
  onFinishedBulkTagging,
  onFinishedBulkDeletion,
}: any) => {
  const [addTagsToTasks] = useMutation(MUTATION_ADD_TAGS_TO_TASKS, {
    refetchQueries: [{ query: QUERY_GET_TASKS }],
  });

  const [bulkDeleteMutation] = useMutation(BULK_DELETE_TASKS, {
    refetchQueries: [{ query: QUERY_GET_TASKS }],
  });

  const [tagSelection, setTagSelection] = useState([]);

  const handleBulkTagging = async () => {
    const tagIds = tagSelection.map((tag: any) => tag);

    if (!tagIds.length) return;

    const taskIds = selectedRecords.map((task: any) => task.id);

    try {
      await addTagsToTasks({
        variables: {
          data: {
            tagIds,
            taskIds,
          },
        },
      });

      onFinishedBulkTagging();
      setTagSelection([]);

      showNotification({
        notificationType: NotificationType.SUCCESS,
        title: 'Tags added',
        message: 'Good job!',
      });
    } catch (e: any) {
      showNotification({
        notificationType: NotificationType.ERROR,
        title: 'There was an error adding the tags:',
        error: e,
      });
    }
  };

  const onBulkDeletion = () => {
    openConfirmModal({
      title: 'Delete tasks',
      centered: true,
      children: (
        <Text size="sm">Are you sure you want to delete these tasks?</Text>
      ),
      labels: { confirm: 'Delete tasks', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => handleBulkDeletion(selectedRecords),
    });
  };

  const handleBulkDeletion = async (selection: any) => {
    try {
      await bulkDeleteMutation({
        variables: {
          taskIds: selection.map((item: any) => item.id),
        },
      });

      setTagSelection([]);

      showNotification({
        notificationType: NotificationType.SUCCESS,
        title: 'Tasks successfully deleted!',
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
      <Group justify="space-between" gap="xs">
        <Group gap="xs">
          <Popover
            width={300}
            position="bottom"
            withArrow
            closeOnEscape={false}
            shadow="md"
          >
            <Popover.Target>
              <Button
                size="xs"
                variant="default"
                leftSection={<IconTags size="1rem" stroke={1.5} />}
              >
                Add Tags
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Stack gap="sm">
                <ComboMultiSelect
                  size="sm"
                  createMutationConfig={{
                    mutation: MUTATION_CREATE_TAG,
                    variables: (itemLabel: any) => ({ name: itemLabel }),
                    formatMutationResponse: (data: any) => data.createTag.id,
                  }}
                  loaderQuery={QUERY_GET_TAGS}
                  placeholder="Select tags or create new ones"
                  formatData={(data: any) =>
                    data?.getTags?.edges?.map((item: any) => ({
                      value: item.node.id,
                      label: item.node.name,
                    }))
                  }
                  selectedValues={tagSelection}
                  onChange={setTagSelection}
                />

                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleBulkTagging()}
                >
                  Add Tags
                </Button>
              </Stack>
            </Popover.Dropdown>
          </Popover>

          <Button size="xs" variant="default" onClick={() => onBulkDeletion()}>
            Delete
          </Button>
        </Group>
      </Group>
    </Box>
  );
};

export default TaskBulkActions;
