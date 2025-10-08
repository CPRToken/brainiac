// src/pages/dashboard/index.tsx
import type { NextPage } from 'next';
import { useMemo, useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'src/libs/firebase';
import { TrialPlan } from 'src/sections/components/trial-plan';
import { useRouter } from "next/router";
import Dialog from '@mui/material/Dialog';

import { socialApi } from "src/api/social/socialApi";
import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { OverviewDoneArticles } from 'src/sections/dashboard/overview/overview-done-articles';
import { OverviewTimeSaved } from 'src/sections/dashboard/overview/overview-time-saved';
import { OverviewDoneImages } from 'src/sections/dashboard/overview/overview-done-images';
import { OverviewClicks } from 'src/sections/dashboard/overview/overview-clicks';
import { OverviewSignups } from 'src/sections/dashboard/overview/overview-signups';
import { OverviewConversions } from 'src/sections/dashboard/overview/overview-conversions';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React from "react";
import { useTranslation } from "react-i18next";
import { typography } from 'src/theme/typography';
import { tokens } from 'src/locales/tokens';
import { paths } from 'src/paths';
import SvgColor from 'src/components/svg-color';
import type { Profile } from 'src/types/social';
import { useTheme } from "@mui/material/styles";

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
            sx={{ width: '100%', height: '100%' }}
          />
        </Box>

        <Typography sx={{ ...typography.subtitle1, color: 'text.primary' }}>
          {module.name}
        </Typography>
        <Typography sx={{ ...typography.subtitle2, color: 'text.secondary' }}>
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

  usePageView();

  const modules: ModuleItem[] = [
    { name: t(tokens.headings.imageGenerator), path: paths.dashboard.imageGenerator, icon: '/assets/icons/images.svg', about: t(tokens.form.imageAbout) },
    { name: t(tokens.headings.lyricWriter), path: paths.dashboard.lyricWriter, icon: '/assets/icons/lyric.svg', about: t(tokens.form.lyricWriterAbout) },
    { name: t(tokens.headings.scriptWriter), path: paths.dashboard.scriptWriter, icon: '/assets/icons/movie.svg', about: t(tokens.form.scriptWriterAbout) },
    { name: t(tokens.headings.recipeWriter), path: paths.dashboard.recipeGen, icon: '/assets/icons/recipe.svg', about: t(tokens.form.recipeWriterAbout) },
    { name: t(tokens.headings.poemGenerator), path: paths.dashboard.poemGenerator, icon: '/assets/icons/poem.svg', about: t(tokens.form.poemGeneratorAbout) },
    { name: t(tokens.headings.seoArticleWriter), path: paths.dashboard.seoArticleWriter, icon: '/assets/icons/seo.svg', about: t(tokens.form.seoArticleWriterAbout) },
    { name: t(tokens.headings.essayWriter), path: paths.dashboard.essayWriter, icon: '/assets/icons/edu.svg', about: t(tokens.form.essayWriterAbout) },
    { name: t(tokens.headings.editor), path: paths.dashboard.editor, icon: '/assets/icons/editor.svg', about: t(tokens.form.editorAbout) },
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
              await updateDoc(doc(db, 'users', uid), { planStartDate: new Date().toISOString() });
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
    setThumb(null);
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
      try { v.currentTime = 1; } catch {}
    };

    v.addEventListener('loadedmetadata', onLoadedMeta);
    return () => v.removeEventListener('loadedmetadata', onLoadedMeta);
  }, [videoSrc]);

  if (!user) return null;

  return (
    <Container maxWidth="xl" sx={{
      pl: { xs: 2, sm: 4, lg: 6 },
      pr: { xs: 2, sm: 4, lg: 6 }
    }}
    >
      <Typography sx={{ ...typography.h4, mb: 4, mt: 5, pl: 2, textAlign: 'left' }}>
        {t(tokens.nav.dashboard)}
      </Typography>

      {/* ✅ Affiliate Dashboard */}
      {user.role === 'Affiliate' ? (
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Box sx={{ width: '100%', mt: 4, mb: 2 }}>
            <Typography sx={{ ...typography.h6, pl: 2, textAlign: 'left' }}>
              Affiliates
            </Typography>
          </Box>
          <Grid item xs={12} md={4}><OverviewClicks /></Grid>
          <Grid item xs={12} md={4}><OverviewSignups /></Grid>
          <Grid item xs={12} md={4}><OverviewConversions /></Grid>

          <Box sx={{ width: '100%', mt: 4, mb: 2 }}>
            <Typography sx={{ ...typography.h6, pl: 2, textAlign: 'left' }}>
              Hi {user.firstName}
            </Typography>
          </Box>
          <Box sx={{ width: '100%', mt: 6, mb: 2 }}>
            <Typography sx={{ ...typography.h6, pl: 3, textAlign: 'center' }}>
              Your Unique Referral Links:
            </Typography>
            <Box sx={{ width: '100%', mt: 4, mb: 0 }}>
            <Typography sx={{ ...typography.subtitle2, pl: 3, textAlign: 'center' }}>
              click to copy
            </Typography>
            </Box>
          </Box>
          <Box
            sx={{ width: '100%', mt: 1, textAlign: 'center', cursor: 'pointer' }}
            onClick={() => navigator.clipboard.writeText(`https://brainiacmedia.ai?ref=${user.refUrl}`)}
          >
            <Typography
              sx={{
                ...typography.h4,
                textDecoration: 'underline',
                color: 'primary.main',
                display: 'inline',
                '&:hover': { opacity: 0.8 },
              }}
            >
              https://brainiacmedia.ai?ref={user.refUrl}
            </Typography>
          </Box>
          <Box
            sx={{ width: '100%', mt: 2, textAlign: 'center', cursor: 'pointer' }}
            onClick={() => navigator.clipboard.writeText(`https://brainiacmedia.ai/pricing?ref=${user.refUrl}`)}
          >
            <Typography
              sx={{
                ...typography.h4,
                textDecoration: 'underline',
                color: 'primary.main',
                display: 'inline',
                '&:hover': { opacity: 0.8 },
              }}
            >
              https://brainiacmedia.ai/pricing?ref={user.refUrl}
            </Typography>
          </Box>
        </Grid>

      ) : (


        <>
          {/* Trial + Upgrade */}
          {hasTrial && (
            <>
              <Box sx={{ mb: 4 }}><TrialPlan /></Box>
              <Box sx={{ p: 0, pt: 1, pb: 3, mb: 3 }}>
                <Button component="a" href="/pricing" variant="contained" color="primary"
                        sx={{ width: { xs: '100%', sm: '50%', md: '30%' }, ml: 0 }}>
                  <Typography sx={{ ...typography.body1, textAlign: 'center' }}>
                    {t(tokens.nav.upgrade)}
                  </Typography>
                </Button>
              </Box>
            </>
          )}

          {/* Normal Overview */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={12} md={4}><OverviewDoneArticles /></Grid>
            <Grid item xs={12} md={4}><OverviewDoneImages /></Grid>
            <Grid item xs={12} md={4}><OverviewTimeSaved /></Grid>
          </Grid>

          {/* How to use video */}
          <Box sx={{ width: '100%', mb: 3 }}>
            <Typography sx={{ ...typography.h4, pl: 3, textAlign: 'left' }}>
              {t(tokens.headings.howToUse)}
            </Typography>
          </Box>
          <video ref={hiddenVidRef} src={videoSrc} preload="metadata" style={{ display: 'none' }} />
          <Grid item xs={12} sm={10} md={8}>
            <Box onClick={() => setOpen(true)}
                 sx={{ mx: 'auto', width: { xs: '100%', sm: 250 }, aspectRatio: '16/9', borderRadius: 2,
                   overflow: 'hidden', cursor: 'pointer', boxShadow: 3, '&:hover': { boxShadow: 6 },
                   display: 'grid', placeItems: 'center', bgcolor: 'black', border: '1px solid #fff' }}>
              {thumb ? (
                <Box component="img" src={thumb} alt="Video thumbnail"
                     sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <video src={videoSrc} muted playsInline preload="metadata"
                       style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </Box>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md"
                    PaperProps={{ sx: { bgcolor: 'background.default' } }}>
              <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Box sx={{ width: '100%', aspectRatio: '16/9' }}>
                  <video key={open ? 'open' : 'closed'} width="100%" controls preload="none"
                         style={{ width: '100%', height: '100%' }}>
                    <source src={videoSrc} type="video/mp4" />
                  </video>
                </Box>
              </Box>
            </Dialog>
          </Grid>

          {/* Popular AI tools */}
          <Box sx={{ width: '100%', mb: 3 }}>
            <Typography sx={{ ...typography.h4, mb: 1, mt: 7, pl: 3, textAlign: 'left' }}>
              {t(tokens.headings.popularAItools)}
            </Typography>
          </Box>
          <Box sx={{
            gap: 2, px: { xs: 1, lg: 4 }, mt: 2, mb: 2, display: 'grid',
            my: { xs: 6, sm: 10, md: 12 },
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }
          }}>
            {modules.map((module) => (
              <ModuleItemComponent key={module.name} module={module} />
            ))}
          </Box>
        </>
      )}
    </Container>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
