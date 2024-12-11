import { useMutation, useQuery } from '@apollo/client';
import {
  Badge,
  Box,
  Drawer,
  Group,
  LoadingOverlay,
  Space,
  Text,
} from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MUTATION_DELETE_TASK } from '../../../api/mutations';
import { QUERY_GET_TASKS, QUERY_GET_TASK_DETAIL } from '../../../api/queries';
import ErrorWrangler from '../../../components/common/ErrorWrangler';
import { FORM_MODE } from '../../../components/forms/FormBase';
import Page from '../../../components/page/Page';
import { Paths } from '../../../routes/paths';
import { NotificationType, showNotification } from '../../../utils/utils';
import TaskForm from './TaskForm';

const TaskDetailPage = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [opened, setOpened] = useState(false);

  const { id: taskId } = params || {};

  const { loading, error, data, refetch } = useQuery(QUERY_GET_TASK_DETAIL, {
    variables: {
      taskId,
    },
  });
  const [deleteMutation, { loading: deleting }] = useMutation(
    MUTATION_DELETE_TASK,
    {
      refetchQueries: [{ query: QUERY_GET_TASKS }],
    },
  );

  const handleConfirm = () => {
    deleteMutation({
      variables: {
        taskId,
      },
    })
      .then(() => {
        navigate(Paths.Tasks, { replace: true });
        showNotification({
          notificationType: NotificationType.SUCCESS,
          title: 'Deleted task!',
          message: 'This was nice! We should do this again!',
        });
      })
      .catch((e) => {
        showNotification({
          notificationType: NotificationType.ERROR,
          title: 'There was an error creating this task:',
          error: e,
        });
      });
  };

  const onDelete = () => {
    openConfirmModal({
      title: 'Delete task',
      centered: true,
      children: (
        <Text size="sm">Are you sure you want to delete this task?</Text>
      ),
      labels: { confirm: 'Delete task', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => handleConfirm(),
    });
  };

  const onSuccess = () => {
    refetch();
    setOpened(false);
    showNotification({
      notificationType: NotificationType.SUCCESS,
      title: 'Task updated!',
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

  return (
    <Page
      title={data?.getTaskById?.title}
      backLink={{
        label: 'Tasks',
        to: Paths.Tasks,
      }}
      primaryAction={{
        content: 'Edit task',
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
      <ErrorWrangler error={error} />
      <Text>{data.getTaskById.description}</Text>
      <Space h="md" />
      <Group gap="sm">
        {data.getTaskById.tags.map((tag: any) => (
          <Badge key={tag.id} variant="default">
            {tag.name}
          </Badge>
        ))}
      </Group>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Edit Task"
        padding="md"
        size="md"
        position="right"
      >
        <TaskForm
          mode={FORM_MODE.EDIT}
          entityId={taskId}
          onSubmit={onSuccess}
        />
      </Drawer>
    </Page>
  );
};

export default TaskDetailPage;
