import type { NextPage } from 'next';
import { addDays, subDays } from 'date-fns';

import Box from '@mui/material/Box';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';

import Typography from '@mui/material/Typography';

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { OverviewBanner } from 'src/sections/dashboard/overview/overview-banner';
import { OverviewDoneArticles } from 'src/sections/dashboard/overview/overview-done-articles';
import { OverviewEvents } from 'src/sections/dashboard/overview/overview-events';

import { OverviewTransactions } from 'src/sections/dashboard/overview/overview-transactions';
import { OverviewDoneImages } from 'src/sections/dashboard/overview/overview-done-images';
import { OverviewSubscriptionUsage } from 'src/sections/dashboard/overview/overview-subscription-usage';
import { OverviewHelp } from 'src/sections/dashboard/overview/overview-help';
import { OverviewJobs } from 'src/sections/dashboard/overview/overview-jobs';
import { OverviewTimeSaved } from 'src/sections/dashboard/overview/overview-time-saved';
import { OverviewTips } from 'src/sections/dashboard/overview/overview-tips';

const now = new Date();

const Page: NextPage = () => {
  const settings = useSettings();

  usePageView();

  return (
    <>
      <Seo title="Dashboard: Overview" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <Grid
            container
            disableEqualOverflow
            spacing={{
              xs: 3,
              lg: 4,
            }}
          >
            <Grid xs={12}>
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={4}
              >
                <div>
                  <Typography variant="h4">Dash</Typography>
                </div>

              </Stack>
            </Grid>
            <Grid
              xs={12}
              md={4}
            >
              <OverviewDoneArticles  />
            </Grid>
            <Grid
              xs={12}
              md={4}
            >
              <OverviewDoneImages  />
            </Grid>
            <Grid
              xs={12}
              md={4}
            >
              <OverviewTimeSaved  />
            </Grid>
            <Grid
              xs={12}
              md={7}
            >
              <OverviewBanner />
            </Grid>
            <Grid
              xs={12}
              md={5}
            >
              <OverviewTips
                sx={{ height: '100%' }}
                tips={[
                  {
                    title: 'New fresh design.',
                    content:
                      'Your favorite template has a new trendy look, more customization options, screens & more.',
                  },
                  {
                    title: 'Tip 2.',
                    content: 'Tip content',
                  },
                  {
                    title: 'Tip 3.',
                    content: 'Tip content',
                  },
                ]}
              />
            </Grid>
            <Grid
              xs={12}
              md={7}
            >
              <OverviewSubscriptionUsage
                chartSeries={[
                  {
                    name: 'This year',
                    data: [40, 37, 41, 42, 45, 42, 36, 45, 40, 44, 38, 41],
                  },
                  {
                    name: 'Last year',
                    data: [26, 22, 19, 22, 24, 28, 23, 25, 24, 21, 17, 19],
                  },
                ]}
              />
            </Grid>
            <Grid
              xs={12}
              md={5}
            >

              <OverviewTransactions
                transactions={[
                  {
                    id: 'd46800328cd510a668253b45',
                    amount: 25000,
                    createdAt: now.getTime(),
                    currency: 'usd',
                    sender: 'Devias',
                    status: 'on_hold',
                    type: 'receive',
                  },
                  {
                    id: 'b4b19b21656e44b487441c50',
                    amount: 6843,
                    createdAt: subDays(now, 1).getTime(),
                    currency: 'usd',
                    sender: 'Zimbru',
                    status: 'confirmed',
                    type: 'send',
                  },
                  {
                    id: '56c09ad91f6d44cb313397db',
                    amount: 91823,
                    createdAt: subDays(now, 1).getTime(),
                    currency: 'usd',
                    sender: 'Vertical Jelly',
                    status: 'failed',
                    type: 'send',
                  },
                  {
                    id: 'aaeb96c5a131a55d9623f44d',
                    amount: 49550,
                    createdAt: subDays(now, 3).getTime(),
                    currency: 'usd',
                    sender: 'Devias',
                    status: 'confirmed',
                    type: 'receive',
                  },
                ]}
              />
            </Grid>
            <Grid
              xs={12}
              md={5}
            >
              <OverviewEvents
                events={[
                  {
                    id: '3bfa0bc6cbc99bf747c94d51',
                    createdAt: addDays(now, 1),
                    description: '17:00 to 18:00',
                    title: 'Meeting with Partners',
                  },
                  {
                    id: 'dd6c8ce8655ac222b01f24f9',
                    createdAt: addDays(now, 4),
                    description: '17:00 to 18:00',
                    title: 'Weekly Meeting',
                  },
                  {
                    id: 'f274902e2bf226865b3cf947',
                    createdAt: addDays(now, 4),
                    description: '17:00 to 18:00',
                    title: 'Weekly Meeting',
                  },
                  {
                    id: 'd2a66e24110f52acb0cd0b9f',
                    createdAt: addDays(now, 7),
                    description: '17:00 to 18:00',
                    title: 'Weekly Meeting',
                  },
                ]}
              />
            </Grid>
            <Grid xs={6}>
              <OverviewJobs />
            </Grid>
            <Grid xs={6}>
              <OverviewHelp />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
