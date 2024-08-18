import type { NextPage } from 'next';
import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import {TrialPlan} from 'src/sections/components/trial-plan';
import { useRouter } from "next/router";
import { socialApi } from "src/api/social/socialApi";
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { MyContent } from 'src/sections/components/quick-stats/my-content';
import { MyImages } from 'src/sections/components/quick-stats/my-images';
import { Previewer } from 'src/sections/components/previewer';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { typography } from 'src/theme/typography';
import { tokens } from 'src/locales/tokens';
import { paths } from 'src/paths';
import SvgColor from 'src/components/svg-color';
import type { Profile } from 'src/types/social';

import {useTheme} from "@mui/material/styles";

type ModuleItem = {
  name: string;
  path: string;
  icon: string;
  about: string;

};

type ModuleItemProps = {
  module: ModuleItem;
};

const ModuleItemComponent: React.FC<ModuleItemProps> = ({ module }) => {
  const router = useRouter();
  const theme = useTheme();
  const [hovered, setHovered] = React.useState(false);

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  return (

    <Paper
      onClick={() => router.push(module.path)}
      variant="outlined"
      sx={{
        pt: '80%',
        width: '90%',
        minHeight: '90px',
        borderRadius: 2,
        cursor: 'pointer',
        textAlign: 'center',
        position: 'relative',
        bgcolor: hovered ? 'background.paper' : 'transparent',
        transition: theme.transitions.create('all'),
        '&:hover': {
          bgcolor: 'background.paper',
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
        },
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 1,
          height: 1,
          top: 0,
          position: 'absolute',
        }}
      >
        <Box
          className="svg-color"
          sx={{
            mb: 2,
            mt: 0,
            width: 50,
            height: 50,
            mx: 'auto',
            display: 'flex',
            borderRadius: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 1, sm: 0 },
          }}
        >
          <SvgColor
            src={module.icon}
            color={hovered ? theme.palette.primary.main : 'info'}
            sx={{
              width: '100%',
              height: '100%',
            }}
          />
        </Box>

        <Typography
          sx={{
            ...typography.subtitle1,
            color: 'text.primary',
            mt: { xs: 0, sm: 0 },
            mb: { xs: 0, sm: 0 },
            pl: { xs: 1, sm: 0 },
            pr: { xs: 1, sm: 0 },
          }}
        >
          {module.name}
        </Typography>

        <Typography
          sx={{
            ...typography.subtitle2,
            color: 'text.secondary',
            mt: { xs: 0, sm: 1 },
            mb: { xs: 1, sm: 1 },
            pl: { xs: 1, sm: 0 },
            pr: { xs: 1, sm: 0 },
          }}
        >
          {module.about}
        </Typography>
      </Stack>
    </Paper>
  );
};

const Page: NextPage = () => {

  const [user, setUser] = useState<Profile | null>(null);

  const [userPlan, setUserPlan] = useState<string>('');
  const { t } = useTranslation();
  const settings = useSettings();




  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const uid = currentUser.uid;
        try {
          const userData = await socialApi.getProfile({ uid });
          setUserPlan(userData.plan || ''); // Default to empty string if undefined
          if (!userData) {
            console.error("User data not found");
            return;
          }

          setUser(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);







  usePageView();

  const components: { element: JSX.Element; title: string }[] = [
    {
      element: <MyContent />,
      title: t(tokens.headings.myGenContent),
    },
    {
      element: <MyImages />,
      title: t(tokens.headings.myGenImages),
    },
  ];

  const modules: ModuleItem[] = [
    { name: t(tokens.headings.imageGenerator), path: paths.dashboard.imageGenerator, icon: '/assets/icons/images.svg', about: t(tokens.form.imageAbout),  },
    { name: t(tokens.headings.lyricWriter), path: paths.dashboard.lyricWriter, icon: '/assets/icons/lyric.svg', about: t(tokens.form.lyricWriterAbout),  },
    { name: t(tokens.headings.scriptWriter), path: paths.dashboard.scriptWriter, icon: '/assets/icons/movie.svg', about: t(tokens.form.scriptWriterAbout),  },
    { name: t(tokens.headings.recipeWriter), path: paths.dashboard.recipeGen, icon: '/assets/icons/recipe.svg', about: t(tokens.form.recipeWriterAbout),  },
    { name: t(tokens.headings.poemGenerator), path: paths.dashboard.poemGenerator, icon: '/assets/icons/poem.svg', about: t(tokens.form.poemGeneratorAbout),  },
    { name: t(tokens.headings.seoArticleWriter), path: paths.dashboard.seoArticleWriter, icon: '/assets/icons/seo.svg', about: t(tokens.form.seoArticleWriterAbout),  },
    { name: t(tokens.headings.essayWriter), path: paths.dashboard.essayWriter, icon: '/assets/icons/edu.svg', about: t(tokens.form.essayWriterAbout),  },
    { name: t(tokens.headings.editor), path: paths.dashboard.editor, icon: '/assets/icons/editor.svg', about: t(tokens.form.editorAbout), },

  ];
  const hasTrial = useMemo(() => userPlan === 'Trial', [userPlan]);


  return (
    <>
      <Container maxWidth="xl">

      <Typography sx={{
        ...typography.h4,
        mb: 4,
        mt: 0,
        pl: 2,
        pr: 0,
        textAlign: 'left'
      }}>{t(tokens.nav.dashboard)}</Typography>

        {hasTrial && (
          <Box sx={{ p: 0, pb:3, mb: 3 }}>

              <Button
                component="a"
                href="/upgrade"
                variant="contained"
                color="primary"
                sx={{
                  width: {
                    xs: '100%',
                  sm: '50%',
                    md: '30%',
                    lg: '30%',
                  },
                  display: 'inline-block',
                  ml: 0, // Aligns the button to the left
                }}
              >

                <Typography sx={{ ...typography.body1, color: 'text.primary', textAlign: 'center', textDecoration: 'none'  }}>
                  {t(tokens.nav.upgrade)}
                </Typography>
            </Button>

        </Box>
        )}



      <Typography sx={{ ...typography.h6, mb: 2, mt: 1, pl: 3, pr: 0, textAlign: 'left' }}>
        {t(tokens.form.hello)} {user?.firstName}, {t(tokens.form.yourIdeas)}
      </Typography>

        {/* Small Chart Component */}
        <Box sx={{ width: { xs: '75px', sm: '140px', md: '180px' }, height: 'auto' }}>

        </Box>


      {/* Other content below */}
      <Seo title="Dashboard: Overview" />
    </Container>


      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
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
          <Stack spacing={8}>
          <Box sx={{ width: '100%', mb: 4 }}>
            <Typography sx={{ ...typography.h6, mb: 2, mt: 0, pl: 3, pr: 0, textAlign: 'left' }}>
              {t(tokens.headings.popularAItools)}
            </Typography>
          </Box>

          <Box
            sx={{
              gap: { xs: 2, sm: 2, md: 2, lg: 2 },
              paddingLeft: { xs: 1, sm: 1, md: 1, lg: 4 },
              paddingRight: { xs: 1, sm: 1, md: 1, lg: 4 },
              mt: { xs: 2, sm: 2, md: 2, lg: 2 },
              mb: { xs: 2, sm: 2, md: 2, lg: 2 },
              display: 'grid',
              my: { xs: 6, sm: 10, md: 12 },
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
            }}
          >
            {modules.map((module) => (
              <ModuleItemComponent key={module.name} module={module} />
            ))}
          </Box>
            {hasTrial && (
              <Box sx={{ mb: 4 }}>
                <TrialPlan />
              </Box>
            )}
          <Box sx={{ mt: 8 }}>


            <Grid container spacing={{ xs: 3, lg: 4 }}>
              {/* Add content here */}
            </Grid>
          </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
};




Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

