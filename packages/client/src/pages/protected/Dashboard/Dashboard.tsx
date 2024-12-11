import { useQuery } from '@apollo/client';
import {
  Anchor,
  Box,
  Button,
  Grid,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import {
  IconListCheck,
  IconListNumbers,
  IconTags,
  IconUser,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { QUERY_GET_HOME_PAGE_DATA } from '../../../api/queries';
import CardSection from '../../../components/cards/cardSection/CardSection';
import UserActivityCardSectionRow from '../../../components/cards/cardSection/UserActivityCardSectionRow';
import UserCardSectionRowComponent from '../../../components/cards/cardSection/UserRowCardSectionRowComponent';
import ErrorWrangler from '../../../components/common/ErrorWrangler';
import Page from '../../../components/page/Page';
import StatsCard from '../../../components/stats/StatsCard';
import { Paths } from '../../../routes/paths';
import DateService from '../../../utils/TimeService';
import BarChartDemo from '../../../components/charts/barChart/BarChartDemo';
import LineChartDemo from '../../../components/charts/lineChart/LineChartDemo';

const Dashboard = () => {
  const {
    loading: fetchingStats,
    data,
    error,
  } = useQuery(QUERY_GET_HOME_PAGE_DATA, {
    fetchPolicy: 'cache-and-network',
  });

  return (
    <Page title="Dashboard" showLoadingOverlay={fetchingStats}>
      <Box>
        <ErrorWrangler error={error} />

        <Stack gap="lg">
          <SimpleGrid spacing="lg" cols={{ base: 1, xs: 2, md: 4 }}>
            <StatsCard
              title="Open tasks"
              number={data?.openTasks?.totalCount}
              Icon={IconListNumbers}
              subline='Tasks that are not marked as "open".'
            />
            <StatsCard
              title="Closed tasks"
              number={data?.doneTasks?.totalCount}
              Icon={IconListCheck}
              subline='Tasks that are marked as "done".'
            />
            <StatsCard
              title="Total tags"
              number={data?.totalTags?.totalCount}
              Icon={IconTags}
              subline="Total number of tags."
            />
            <StatsCard
              title="Users"
              number={data?.totalUsers?.length}
              Icon={IconUser}
              subline="Total number of users."
            />
          </SimpleGrid>
          <Grid gutter="lg">
            <Grid.Col span={{ base: 12, xs: 12, md: 8 }}>
              <Stack gap="lg">
                <CardSection
                  title="Completed tasks YoY"
                  subline="This is the amount of tasks that have been completed each month compared to last year."
                >
                  <LineChartDemo />
                </CardSection>
                <CardSection
                  title="Newest team members"
                  subline="5 new team members joined this month."
                  action={
                    <Button
                      component={Link}
                      to={Paths.TeamSettings}
                      variant="default"
                    >
                      Manage users
                    </Button>
                  }
                >
                  {data?.newestTeamMembers.map((item: any, index: any) => (
                    <UserCardSectionRowComponent key={index} {...item} />
                  ))}
                </CardSection>

                <CardSection
                  title="Pending invitations"
                  subline="There are 3 pending invitations."
                  action={
                    <Button
                      component={Link}
                      to={Paths.TeamSettings}
                      variant="default"
                    >
                      See all
                    </Button>
                  }
                >
                  {data?.pendingInvitations.map((item: any, index: any) => (
                    <UserCardSectionRowComponent key={index} {...item} />
                  ))}
                </CardSection>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, xs: 12, md: 4 }}>
              <Stack gap="lg">
                <CardSection
                  title="Billable hours"
                  subline="Billable hours against non-billable hours."
                >
                  <BarChartDemo />
                </CardSection>
                <CardSection title="Activity">
                  {data?.getActivity?.edges?.map((item: any, index: any) => (
                    <UserActivityCardSectionRow
                      key={index}
                      name={item.node.createdBy?.firstname}
                      activity={
                        <Text lineClamp={1} c="dimmed">
                          Created task{' '}
                          <Anchor
                            component={Link}
                            to={`/tasks/${item.node.id}`}
                          >
                            {item.node.title}
                          </Anchor>
                        </Text>
                      }
                      time={DateService.getReadableDateTimeInNearPast(
                        item.node.createdAt,
                      )}
                      avatar={item.node.createdBy?.avatar}
                    />
                  ))}
                </CardSection>
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      </Box>
    </Page>
  );
};

export default Dashboard;
