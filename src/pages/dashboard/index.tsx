//src/pages/dashboard/index.tsx
import type { NextPage } from 'next';
import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import {doc, updateDoc} from 'firebase/firestore';
import { db } from 'src/libs/firebase';
import {TrialPlan} from 'src/sections/components/trial-plan';
import { useRouter } from "next/router";
import Dialog from '@mui/material/Dialog';

import { socialApi } from "src/api/social/socialApi";
import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { OverviewDoneArticles } from 'src/sections/dashboard/overview/overview-done-articles';
import { OverviewTimeSaved } from 'src/sections/dashboard/overview/overview-time-saved';
import { OverviewDoneImages } from 'src/sections/dashboard/overview/overview-done-images';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState, useRef } from "react";
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
  const { t } = useTranslation();
  const { locale } = useRouter();


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
  const [userPlan, setUserPlan] = useState('');
  const settings = useSettings();
  const [open, setOpen] = useState(false);
  const [thumb, setThumb] = useState<string | null>(null);
  const hiddenVidRef = useRef<HTMLVideoElement | null>(null);
  const { t } = useTranslation();
  const theme = useTheme();


  usePageView();

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

  useEffect(() => {
    const auth = getAuth();
    let poller: number;

    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) return;
      const uid = u.uid;

      const check = async () => {
        const profile = await socialApi.getProfile({ uid });
        setUser(profile);
        setUserPlan(profile.plan || '');

        if (profile.priceId === 'pending') {
          poller = window.setInterval(async () => {
            const p = await socialApi.getProfile({ uid });
            setUser(p);
            setUserPlan(p.plan || '');
            if (p.priceId && p.priceId !== 'pending') {
              await updateDoc(doc(db, 'users', uid), {
                planStartDate: new Date().toISOString(),
              });
              clearInterval(poller);
            }
          }, 2000);
        }
      };

      check().catch(err => {
        console.error('Profile check failed:', err);
        clearInterval(poller);
      });
    });

    return () => {
      unsub();
      clearInterval(poller);
    };
  }, []);

  const videoSrc = t(tokens.form.howtoVideo);

  const hasTrial = useMemo(() => userPlan === 'Trial' || userPlan === 'Expired', [userPlan]);

  useEffect(() => {
    setThumb(null); // clear old image whenever videoSrc changes

    const v = hiddenVidRef.current;
    if (!v) return;

    const onLoadedMeta = () => {
      const onSeeked = () => {
        const c = document.createElement('canvas');
        c.width = v.videoWidth;
        c.height = v.videoHeight;
        const ctx = c.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(v, 0, 0, c.width, c.height);
        setThumb(c.toDataURL('image/jpeg', 0.8));
        v.removeEventListener('seeked', onSeeked);
      };
      v.addEventListener('seeked', onSeeked);
      try {
        v.currentTime = 1; // seek to 1 second instead of 0.1
      } catch {}
    };

    v.addEventListener('loadedmetadata', onLoadedMeta);
    return () => v.removeEventListener('loadedmetadata', onLoadedMeta);
  }, [videoSrc]);



  return (
    <>
      <Container maxWidth="xl">
        <Typography
          sx={{
            ...typography.h4,
            mb: 4,
            mt: 0,
            pl: 2,
            pr: 0,
            textAlign: 'left',
          }}
        >
          {t(tokens.nav.dashboard)}
        </Typography>

        {hasTrial && (
          <Box sx={{ mb: 4 }}>
            <TrialPlan />
          </Box>
        )}

        {hasTrial && (
          <Box sx={{ p: 0, pt: 1, pb: 3, mb: 3 }}>
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
                ml: 0,
              }}
            >
              <Typography
                sx={{
                  ...typography.body1,
                  color: 'text.primary',
                  textAlign: 'center',
                  textDecoration: 'none',
                }}
              >
                {t(tokens.nav.upgrade)}
              </Typography>
            </Button>
          </Box>
        )}

        {/* Main content */}
        <Box
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth={settings.stretch ? false : 'xl'}>
            <Grid
              container

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

                </Stack>
              </Grid>

              {/* Add your three cells */}
              <Grid xs={12} md={4}>
                <Box sx={{ p: 2 }}>
                  <OverviewDoneArticles />
                </Box>
              </Grid>
              <Grid xs={12} md={4}>
                <Box sx={{ p: 2 }}>
                  <OverviewDoneImages />
                </Box>
              </Grid>
              <Grid xs={12} md={4}>
                <Box sx={{ p: 2 }}>
                  <OverviewTimeSaved />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* AI tools section */}
        <Box component="main" sx={{ flexGrow: 1, py: 5 }}>
          <Container maxWidth={settings.stretch ? false : 'xl'}>
            <Stack spacing={8}>

              <Box sx={{ width: '100%', mb: 3 }}>
                <Typography
                  sx={{
                    ...typography.h4,
                    mb: 0,
                    mt: 0,
                    pl: 3,
                    pr: 0,
                    textAlign: 'left',
                  }}
                >
                  {t(tokens.headings.howToUse)}
                </Typography>
              </Box>

              <video
                ref={hiddenVidRef}
                src={videoSrc}
                preload="metadata"
                style={{ display: 'none' }}
              />

              {/* Thumbnail (real still from the video) */}
              <Grid item xs={12} sm={10} md={8}>
                <Box
                  onClick={() => setOpen(true)}
                  sx={{
                    mx: 'auto',
                    width: { xs: '100%', sm: 250 },
                    aspectRatio: '16/9',
                    borderRadius: 2,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: 3,
                    '&:hover': { boxShadow: 6 },
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: 'black',
                    border: '1px solid #fff' // 2px white border
                  }}
                >
                  {thumb ? (
                    <Box
                      component="img"
                      src={thumb}
                      alt="Video thumbnail"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    // fallback: tiny muted video paused at first frame if thumb not ready yet
                    <video src={videoSrc} muted playsInline preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </Box>

                {/* Dialog with the actual video */}
                <Dialog
                  open={open}
                  onClose={() => setOpen(false)}
                  fullWidth
                  maxWidth="md"
                  PaperProps={{ sx: { bgcolor: 'background.default' } }}
                >
                  <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                    <Box sx={{ width: '100%', aspectRatio: '16/9' }}>
                      <video
                        key={open ? 'open' : 'closed'}  // resets on close
                        width="100%"
                        controls
                        preload="none"
                        style={{ width: '100%', height: '100%' }}
                      >
                        <source src={videoSrc} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </Box>
                  </Box>
                </Dialog>
              </Grid>

              <Box sx={{ width: '100%', mb: 3 }}>
                <Typography
                  sx={{
                    ...typography.h4,
                    mb: 1,
                    mt: 7,
                    pl: 3,
                    pr: 0,
                    textAlign: 'left',
                  }}
                >
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

              <Box sx={{ mt: 8 }}>
                <Grid container spacing={{ xs: 3, lg: 4 }}>
                  {/* Add content here */}
                </Grid>
              </Box>
            </Stack>
          </Container>
        </Box>
      </Container>
    </>
  );

};




Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

function productIdToPlan(priceId: string): string {
  const priceToPlan: Record<string, string> =

    {
      'price_1QNpMjI7exj9oAo9ColPjP1G': 'Basic',
      'price_1QNpZYI7exj9oAo9f2IXAwdx': 'Premium',
      'price_1QNpgKI7exj9oAo9DMTVCQBz': 'Business',
      'price_1QNpQPI7exj9oAo9rx2W7jkg': 'BasicYearly',
      'price_1QNpeNI7exj9oAo9mCyQ1FJa': 'PremiumYearly',
      'price_1QNpiKI7exj9oAo9CcI657sF': 'BusinessYearly',
      'price_1QNpX8I7exj9oAo9erM3juYm': 'Basic',
      'price_1QNpl9I7exj9oAo9PaBuwzY2': 'Premium',
      'price_1QNpo4I7exj9oAo9fUqEamTZ': 'Business',
      'price_1QNpV9I7exj9oAo9Aq2lz9Uz': 'BasicYearly',
      'price_1QNppOI7exj9oAo9ufdAPG5x': 'PremiumYearly',
      'price_1QNps4I7exj9oAo9O6sC4IRL': 'BusinessYearly',
      'price_canceled': 'Canceled'
    };

  return priceToPlan[priceId] || 'Unknown';
}
