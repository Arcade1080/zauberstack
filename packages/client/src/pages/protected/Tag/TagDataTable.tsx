import { useMutation } from '@apollo/client';
import {
  ActionIcon,
  Anchor,
  Badge,
  Box,
  Button,
  Group,
  Text,
} from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { IconTrash } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MUTATION_DELETE_TAG } from '../../../api/mutations';
import TableEmptyState from '../../../components/emptyState/TableEmptyState';
import { useSearch } from '../../../components/search/SearchProvider';
import classes from '../../../theme/DataTable.module.css';
import { theme } from '../../../theme/theme';
import DateService from '../../../utils/TimeService';
import { NotificationType, showNotification } from '../../../utils/utils';
import TagBulkActions from './TagBulkActions';

type TagDataTableProps = {
  onEmptyStateCtaClick?: () => void;
};

const TagDataTable = ({ onEmptyStateCtaClick }: TagDataTableProps) => {
  // @ts-ignore
  const { searchState, updateSearchState, hits, loading, loadFirstPage } =
    useSearch();
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [deleteTagMutation] = useMutation(MUTATION_DELETE_TAG);

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

  const handleConfirmDeleteTag = async (id: any) => {
    try {
      await deleteTagMutation({
        variables: {
          id,
        },
      });

      showNotification({
        notificationType: NotificationType.SUCCESS,
        title: 'Deleted tag!',
        message: 'Good job!',
      });

      loadFirstPage();
    } catch (e: any) {
      showNotification({
        notificationType: NotificationType.ERROR,
        title: 'There was an error deleting this tag:',
        error: e,
      });
    }
  };

  const onDeleteTag = (tagId: string) => {
    openConfirmModal({
      title: 'Delete tag',
      centered: true,
      children: (
        <Text size="sm">Are you sure you want to delete this tag?</Text>
      ),
      labels: { confirm: 'Delete tag', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => handleConfirmDeleteTag(tagId),
    });
  };

  return (
    <>
      <Box pos="relative" style={{ zIndex: 0 }}>
        <TagBulkActions
          onFinishedBulkDeletion={onFinishedBulkDeletion}
          selectedRecords={selectedRecords}
        />
        <DataTable
          records={hits?.edges.map((item: any) => item.node)}
          fetching={loading}
          withTableBorder
          horizontalSpacing="xs"
          verticalSpacing="sm"
          onSortStatusChange={handleSortStatusChange}
          noRecordsText=""
          striped
          emptyState={
            <TableEmptyState
              title="No tags to show"
              subline="Create new tags or change your filter settings."
              callToAction={
                <Button
                  onClick={onEmptyStateCtaClick}
                  variant="default"
                  size="md"
                >
                  Create tag
                </Button>
              }
            />
          }
          highlightOnHover
          borderRadius={theme.defaultRadius}
          sortStatus={{
            direction: searchState.orderBy.direction,
            columnAccessor: searchState.orderBy.field,
          }}
          classNames={{
            header: `${classes.header} ${
              selectedRecords.length ? classes.selectedRecords : ''
            }`,
            pagination: classes.pagination,
          }}
          columns={[
            {
              accessor: 'name',
              width: 200,
              title: selectedRecords.length
                ? `${selectedRecords.length} selected `
                : 'Title',
              render: (item: any) => (
                <Anchor size="sm" component={Link} to={`/tags/${item.id}`}>
                  {item.name}
                </Anchor>
              ),
            },

            {
              accessor: 'tasks',
              title: 'Tasks',
              render: (item: any) => (
                <Badge variant="default">{item.tasks.length}</Badge>
              ),
            },
            {
              accessor: 'createdAt',
              title: 'Created At',
              sortable: true,
              width: 150,
              render: (item: any) => (
                <Text size="sm">
                  {DateService.getReadableDateTimeInNearPast(item.createdAt)}
                </Text>
              ),
            },

            {
              accessor: 'actions',
              title: '',
              render: (item: any) => (
                <Group justify="center">
                  <ActionIcon
                    variant="subtle"
                    onClick={() => onDeleteTag(item.id)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ),
            },
          ]}
          totalRecords={hits?.totalCount}
          recordsPerPage={searchState.itemsPerPage}
          page={searchState.currentPage}
          onPageChange={handlePaginationChange}
          selectedRecords={selectedRecords}
          // @ts-ignore
          onSelectedRecordsChange={setSelectedRecords}
          minHeight={340}
        />
      </Box>
    </>
  );
};

export default TagDataTable;
