import type { NextPage } from 'next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { socialApi } from "src/api/social/socialApi";
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { OverviewContentWriter } from 'src/sections/dashboard/overview/overview-content-writer';
import type { Profile } from "../../types/social";
import { OverviewImageGenerator } from 'src/sections/dashboard/overview/overview-image-generator';
import { OverviewContent } from 'src/sections/dashboard/overview/overview-content';

import { OverviewJobs } from 'src/sections/dashboard/overview/overview-jobs';
import { OverviewLyricWriter } from 'src/sections/dashboard/overview/overview-lyric-writer';
import { auth } from "../../libs/firebase";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { typography } from "../../theme/typography";
import { tokens } from "../../locales/tokens";
import { MyContent } from 'src/sections/components/quick-stats/my-content';
import { MyImages } from 'src/sections/components/quick-stats/my-images';
import { Previewer } from "../../sections/components/previewer";




const Page: NextPage = () => {
  const uid = auth.currentUser?.uid;
  const [user, setUser] = useState<Profile | null>(null);
  const { t } = useTranslation();
  const settings = useSettings();


  const components: { element: JSX.Element; title: string }[] = [
    {
      element: <MyContent />,
      title: t(tokens.headings.myGenContent) ,
    },
    {

      element: <MyImages />,
      title:  t(tokens.headings.myGenImages) ,


    },
  ];


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

      <Typography sx={{ ...typography.h4, mb: 3, mt: 2, pl: 2, pr: 0, textAlign: 'left' }}>
        {t(tokens.form.hello)} {user?.firstName}, {t(tokens.form.yourIdeas)}
      </Typography>

      <Seo title="Dashboard: Overview" />

      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="lg">
          <Stack spacing={8}>
            {components.map((component) => (
              <Previewer key={component.title} title={component.title}>
                {component.element}
              </Previewer>
            ))}
          </Stack>
        </Container>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <Box sx={{ width: '100%', mb: 4 }}>
            <Typography sx={{ ...typography.h6, mb: 2, mt: 1, pl: 6, pr: 0, textAlign: 'left' }}>
              {t(tokens.headings.popularAItools)}
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 3, lg: 4 }}>
            <Grid item xs={12} md={3}>
              <OverviewContentWriter />
            </Grid>
            <Grid item xs={12} md={3}>
              <OverviewImageGenerator />
            </Grid>
            <Grid item xs={12} md={3}>
              <OverviewLyricWriter />
            </Grid>

          </Grid>

          <Box sx={{ mt: 8 }}>
            <Typography sx={{ ...typography.h6, mb: 2, mt: 2, pl: 6, pr: 0, textAlign: 'left' }}>
              {t(tokens.headings.tips)}
            </Typography>

            <Grid container spacing={{ xs: 3, lg: 4 }}>

            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
