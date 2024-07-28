import type { NextPage } from 'next';
import { addDays, subDays, subHours, subMinutes } from 'date-fns';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { socialApi } from "src/api/social/socialApi";
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';

import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { OverviewBanner } from 'src/sections/dashboard/overview/overview-banner';
import { OverviewContentWriter } from 'src/sections/dashboard/overview/overview-content-writer';
import type { Profile } from "../../types/social";
import { OverviewImageGenerator } from 'src/sections/dashboard/overview/overview-image-generator';
import { OverviewSubscriptionUsage } from 'src/sections/dashboard/overview/overview-subscription-usage';
import { OverviewHelp } from 'src/sections/dashboard/overview/overview-help';
import { OverviewJobs } from 'src/sections/dashboard/overview/overview-jobs';
import { OverviewOpenTickets } from 'src/sections/dashboard/overview/overview-open-tickets';
import { OverviewTips } from 'src/sections/dashboard/overview/overview-tips';
import {auth} from "../../libs/firebase";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {typography} from "../../theme/typography";
import {tokens} from "../../locales/tokens";
import { MyContent } from 'src/sections/components/quick-stats/my-content';

import {Previewer} from "../../sections/components/previewer";


const now = new Date();

const components: { element: JSX.Element; title: string }[] = [

  {
    element: <MyContent />,
    title: 'My Content',
  },
];

const Page: NextPage = () => {
  const uid = auth.currentUser?.uid;
  const [user, setUser] = useState<Profile | null>(null);
  const { t } = useTranslation();
  const settings = useSettings();

  useEffect(() => {
    if (!uid) return; // Exit if uid is null

    const fetchUserData = async () => {
      try {
        const userData = await socialApi.getProfile({ uid });

        if (!userData) {
          console.error("User data not found");
          return;
        }

        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [uid]);

  usePageView();



  return (
    <>

        <Typography sx={{
          ...typography.h3,
          mb: 6,
          mt: 0,
          pl: 2,
          pr: 0,
          textAlign: 'left'
        }}>{t(tokens.nav.dashboard)}</Typography>

      <Typography sx={{...typography.h4, mb: 3, mt: 2, pl: 2, pr: 0, textAlign: 'left'}}>
        {t(tokens.form.hello)} {user?.firstName}, {t(tokens.form.yourIdeas)}
      </Typography>

      <Seo title="Dashboard: Overview"/>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="lg">
            <Stack spacing={8}>
              {components.map((component) => (
                <Previewer
                  key={component.title}
                  title={component.title}
                >
                  {component.element}
                </Previewer>
              ))}
            </Stack>
          </Container>
        </Box>

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


            <Box sx={{width: '100%'}}>
              <Typography sx={{...typography.h6, mb: 2, mt: 2, pl: 6, pr: 0, textAlign: 'left'}}>
                {t(tokens.headings.popularAItools)}
              </Typography>
            </Box>

            <Grid xs={12}>

            </Grid>

            <Grid
              xs={12}
              md={4}
            >

              <OverviewContentWriter/>
            </Grid>
            <Grid
              xs={12}
              md={4}
            >
              <OverviewImageGenerator/>
            </Grid>
            <Grid
              xs={12}
              md={4}
            >
              <OverviewOpenTickets amount={6}/>
            </Grid>


            <Grid
              xs={12}
              md={7}
            >

            </Grid>
            <Grid
              xs={12}
              md={5}
            >

            </Grid>
            <Grid
              xs={12}
              md={7}
            >

            </Grid>
            <Grid
              xs={12}
              md={5}
            >

            </Grid>
            <Grid xs={6}>
              <OverviewJobs/>
            </Grid>
            <Grid xs={6}>
              <OverviewHelp/>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
