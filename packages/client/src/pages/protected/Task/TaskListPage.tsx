import { Drawer, Space } from '@mantine/core';
import { IconChecklist } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MUTATION_CREATE_TAG } from '../../../api/mutations';
import { QUERY_GET_TAGS, QUERY_GET_TASKS } from '../../../api/queries';
import { FORM_MODE } from '../../../components/forms/FormBase';
import Page from '../../../components/page/Page';
import SearchFilter from '../../../components/search/SearchFilter';
import { SearchProvider } from '../../../components/search/SearchProvider';
import AsyncSelectFilter from '../../../components/search/filter/AsyncSelectFilter';
import SearchQueryFilter from '../../../components/search/filter/SearchQueryFilter';
import SelectFilter from '../../../components/search/filter/SelectFilter';
import { NotificationType, showNotification } from '../../../utils/utils';
import TaskDataTable from './TaskDataTable';
import TaskForm from './TaskForm';

export default function TaskListPage() {
  const listLength = 20;

  const navigate = useNavigate();

  const initialSearchState = {
    currentPage: 1,
    itemsPerPage: listLength,
    status: undefined,
    orderBy: {
      direction: 'desc',
      field: 'createdAt',
    },
    filterTagSelection: [],
    searchQuery: '',
  };

  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const onCreateTodo = ({ createTask }: any) => {
    const { id, title } = createTask;
    setDrawerIsOpen(false);
    showNotification({
      notificationType: NotificationType.SUCCESS,
      title: `Created task: ${title}`,
      message: 'This was nice! We should do this again!',
    });
    navigate(`/tasks/${id}`);
  };

  return (
    <Page
      title="Tasks"
      primaryAction={{
        content: 'Create task',
        icon: IconChecklist,
        onClick: () => setDrawerIsOpen(true),
      }}
      subline="Manage your tasks here."
    >
      <SearchProvider
        dataFormatter={(data: any) => data?.getTasks}
        query={QUERY_GET_TASKS}
        initialSearchState={initialSearchState}
      >
        <SearchFilter>
          <SearchQueryFilter filterKey="searchQuery" />
          <AsyncSelectFilter
            loaderQuery={QUERY_GET_TAGS}
            loaderQueryVariables={{ variables: { onlyInUse: true } }}
            filterKey="filterTagSelection"
            afterChange={(updatedState: any) => {
              updatedState.currentPage = 1;
              return updatedState;
            }}
            createMutation={MUTATION_CREATE_TAG}
            formatOptions={(data: any) =>
              data?.getTags?.edges.map((tag: any) => ({
                value: tag.node.id,
                label: tag.node.name,
              }))
            }
          />
          <SelectFilter
            options={[
              { value: 'all', label: 'All' },
              { value: 'open', label: 'Open' },
              { value: 'done', label: 'Done' },
            ]}
            handleChange={(newValue: any) =>
              newValue === 'all' ? undefined : newValue
            }
            afterChange={(updatedState: any) => {
              updatedState.currentPage = 1;
              return updatedState;
            }}
            formatValue={(value: any) => {
              if (value === undefined) {
                return 'all';
              }
              return value;
            }}
            filterKey="status"
          />
        </SearchFilter>
        <Space h="xl" />
        <TaskDataTable onEmptyStateCtaClick={() => setDrawerIsOpen(true)} />
      </SearchProvider>

      <Drawer
        opened={drawerIsOpen}
        onClose={() => setDrawerIsOpen(false)}
        title="Create task"
        padding="xl"
        size="md"
        position="right"
        closeOnEscape={false}
      >
        <TaskForm mode={FORM_MODE.CREATE} onSubmit={onCreateTodo} />
      </Drawer>
    </Page>
  );
}
