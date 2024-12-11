import { Drawer, Space } from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconTag } from '@tabler/icons-react';
import { QUERY_GET_TAGS_LIST } from '../../../api/queries';
import { FORM_MODE } from '../../../components/forms/FormBase';
import Page from '../../../components/page/Page';
import SearchFilter from '../../../components/search/SearchFilter';
import { SearchProvider } from '../../../components/search/SearchProvider';
import SearchQueryFilter from '../../../components/search/filter/SearchQueryFilter';
import { NotificationType, showNotification } from '../../../utils/utils';
import TagDataTable from './TagDataTable';
import TagForm from './TagForm';

export default function TagsListPage() {
  const navigate = useNavigate();

  const listLength = 20;

  const initialSearchState = {
    currentPage: 1,
    itemsPerPage: listLength,
    orderBy: {
      direction: 'desc',
      field: 'createdAt',
    },
    filterTagSelection: [],
    searchQuery: '',
  };

  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const onCreateTag = ({ createTag }: any) => {
    setDrawerIsOpen(false);
    showNotification({
      notificationType: NotificationType.SUCCESS,
      title: 'Created tag!',
      message: 'This was nice! We should do this again!',
    });
    navigate(`/tags/${createTag.id}`);
  };

  return (
    <Page
      title="Tags"
      primaryAction={{
        content: 'Create tag',
        onClick: () => setDrawerIsOpen(true),
        icon: IconTag,
      }}
      subline="Manage your tags here."
    >
      <SearchProvider
        dataFormatter={(data: any) => data?.getTags}
        query={QUERY_GET_TAGS_LIST}
        initialSearchState={initialSearchState}
      >
        <SearchFilter>
          <SearchQueryFilter filterKey="searchQuery" />
        </SearchFilter>
        <Space h="xl" />
        <TagDataTable onEmptyStateCtaClick={() => setDrawerIsOpen(true)} />
      </SearchProvider>

      <Drawer
        opened={drawerIsOpen}
        onClose={() => setDrawerIsOpen(false)}
        title="Create tag"
        padding="xl"
        size="sm"
        position="right"
      >
        <TagForm mode={FORM_MODE.CREATE} onSubmit={onCreateTag} />
      </Drawer>
    </Page>
  );
}
