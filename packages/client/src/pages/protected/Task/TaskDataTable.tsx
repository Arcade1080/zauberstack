import { useMutation } from '@apollo/client';
import {
  ActionIcon,
  Anchor,
  Badge,
  Box,
  Button,
  Chip,
  Group,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { IconTrash } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MUTATION_DELETE_TASK,
  MUTATION_TOGGLE_TASK_STATUS,
} from '../../../api/mutations';
import { QUERY_GET_TASKS } from '../../../api/queries';
import TableEmptyState from '../../../components/emptyState/TableEmptyState';
import { useSearch } from '../../../components/search/SearchProvider';
import { Paths } from '../../../routes/paths';
import classes from '../../../theme/DataTable.module.css';
import DateService from '../../../utils/TimeService';
import { NotificationType, showNotification } from '../../../utils/utils';
import TaskBulkActions from './TaskBulkActions';
import UserDisplay from '../../../components/user/UserDisplay';

type TaskDataTableProps = {
  onEmptyStateCtaClick?: () => void;
};

// @ts-ignore
const TaskDataTable = ({ onEmptyStateCtaClick }: TaskDataTableProps) => {
  // @ts-ignore
  const { searchState, updateSearchState, hits, loading, loadFirstPage } =
    useSearch();
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [deleteTaskMutation] = useMutation(MUTATION_DELETE_TASK, {
    refetchQueries: [
      {
        query: QUERY_GET_TASKS,
      },
    ],
  });

  const theme = useMantineTheme();

  const [toggleTaskStatus] = useMutation(MUTATION_TOGGLE_TASK_STATUS, {
    refetchQueries: [{ query: QUERY_GET_TASKS }],
  });

  const onFinishedBulkTagging = () => {
    setSelectedRecords([]);
  };

  const handleTaskStatusToggle = (taskId: string) => {
    toggleTaskStatus({
      variables: {
        taskId,
      },
    });
  };

  const onFinishedBulkDeletion = () => {
    loadFirstPage();
    setSelectedRecords([]);
  };

  const handlePaginationChange = async (targetPage: any) => {
    updateSearchState({
      currentPage: targetPage,
    });
  };

  const handleSortStatusChange = (sortStatus: any) => {
    updateSearchState({
      orderBy: {
        direction: sortStatus?.direction,
        field: sortStatus?.columnAccessor,
      },
      currentPage: 1,
    });
  };

  const handleConfirmDeleteTask = async (taskId: any) => {
    try {
      const { data } = await deleteTaskMutation({
        variables: {
          taskId,
        },
      });

      showNotification({
        notificationType: NotificationType.SUCCESS,
        title: `Deleted task: ${data.deleteTaskById.title}`,
        message: 'Good job!',
      });

      loadFirstPage();
    } catch (e: any) {
      showNotification({
        notificationType: NotificationType.ERROR,
        title: 'There was an error deleting this task:',
        error: e,
      });
    }
  };

  const onDeleteTask = (taskId: string) => {
    openConfirmModal({
      title: 'Delete task',
      centered: true,
      children: (
        <Text size="sm">Are you sure you want to delete this task?</Text>
      ),
      labels: { confirm: 'Delete task', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => handleConfirmDeleteTask(taskId),
    });
  };

  return (
    <>
      <Box pos="relative" style={{ zIndex: 0 }}>
        <TaskBulkActions
          onFinishedBulkDeletion={onFinishedBulkDeletion}
          onFinishedBulkTagging={onFinishedBulkTagging}
          selectedRecords={selectedRecords}
        />
        <DataTable
          records={hits?.edges.map((item: any) => item.node)}
          fetching={loading}
          withTableBorder
          striped
          highlightOnHover
          borderRadius={theme.defaultRadius}
          classNames={{
            header: `${classes.header} ${
              selectedRecords.length ? classes.selectedRecords : ''
            }`,
            pagination: classes.pagination,
          }}
          emptyState={
            <TableEmptyState
              title="No tasks to show"
              subline="Create new tasks or change your filter settings."
              callToAction={
                <Button
                  onClick={onEmptyStateCtaClick}
                  variant="default"
                  size="md"
                >
                  Create task
                </Button>
              }
            />
          }
          onSortStatusChange={handleSortStatusChange}
          sortStatus={{
            direction: searchState.orderBy.direction,
            columnAccessor: searchState.orderBy.field,
          }}
          totalRecords={hits?.totalCount}
          recordsPerPage={searchState.itemsPerPage}
          pinLastColumn
          page={searchState.currentPage}
          onPageChange={handlePaginationChange}
          selectedRecords={selectedRecords}
          // @ts-ignore
          onSelectedRecordsChange={setSelectedRecords}
          minHeight={340}
          noRecordsText=""
          columns={[
            {
              accessor: 'title',
              width: 250,
              title: selectedRecords.length
                ? `${selectedRecords.length} selected `
                : 'Title',
              render: (item: any) => (
                <Anchor
                  size="sm"
                  underline="always"
                  component={Link}
                  to={`${Paths.Tasks}/${item.id}`}
                >
                  {item.title}
                </Anchor>
              ),
            },
            {
              accessor: 'createdBy',
              width: 250,

              title: 'Created by',
              render: (item: any) => (
                <UserDisplay
                  firstline={`${item?.createdBy?.firstname} ${item?.createdBy?.lastname}`}
                  subline={item?.createdBy?.email}
                  avatar={item?.createdBy?.avatar}
                />
              ),
            },
            {
              accessor: 'tags',
              title: 'Tags',
              width: 300,
              render: (item: any) =>
                item.tags?.map((tag: any) => (
                  <Badge mr="xs" variant="default">
                    {tag.name}
                  </Badge>
                )),
            },
            {
              accessor: 'createdAt',

              title: 'Created',
              sortable: true,
              render: (item: any) => (
                <Text size="sm">
                  {DateService.getReadableDateTimeInNearPast(item.createdAt)}
                </Text>
              ),
            },
            {
              accessor: 'status',
              title: 'Status',
              render: (task: any) => (
                <Chip
                  size="xs"
                  checked={task.status === 'done'}
                  variant="light"
                  onChange={() => handleTaskStatusToggle(task.id)}
                >
                  {task.status === 'done' ? 'Done' : 'Open'}
                </Chip>
              ),
            },
            {
              accessor: 'actions',
              title: '',
              render: (task: any) => (
                <Group gap={4}>
                  <ActionIcon
                    variant="subtle"
                    onClick={() => onDeleteTask(task.id)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ),
            },
          ]}
        />
      </Box>
    </>
  );
};

export default TaskDataTable;
