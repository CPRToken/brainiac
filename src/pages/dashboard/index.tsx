import React, {useEffect, useState} from "react";
import type { NextPage } from 'next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import SvgColor from "src/components/svg-color";
import {socialApi} from "src/api/social/socialApi";
import Typography from '@mui/material/Typography';
import {typography } from "src/theme/typography";
import { useRouter } from 'next/router';
import { useTranslation } from "react-i18next";
import {useTheme} from "@mui/material/styles";

import Paper from '@mui/material/Paper';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';

import { paths } from 'src/paths';
import {tokens} from "../../locales/tokens";
import type {Profile} from "../../types/social";
import {auth} from "../../libs/firebase"; // Ensure paths are correctly imported



type ModuleItem = {
  name: string;
  path: string;
  icon: string;
  about: string;
};

const Page: NextPage = () => {
  const uid = auth.currentUser?.uid;
  const [user, setUser] = useState<Profile | null>(null);
  const { t } = useTranslation();

  useTheme();

  useEffect(() => {
    if (!uid) return; // Exit if uid is null

    const fetchUserData = async () => {
      try {
        const userData = await socialApi.getProfile({ uid });

        if (!userData) {
          console.error("User data not found");
          return;
        }

        setUser(userData);          // Use userData instead of fetchedUser


      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [uid]);


  const modules: ModuleItem[] = [

    { name: t(tokens.headings.imageGenerator), path: paths.dashboard.imageGenerator, icon: '/assets/icons/images.svg', about: t(tokens.form.imageAbout) },
    { name: t(tokens.headings.lyricWriter), path: paths.dashboard.lyricWriter, icon: '/assets/icons/lyric.svg', about: t(tokens.form.lyricWriterAbout) },
    { name: t(tokens.headings.scriptWriter), path: paths.dashboard.scriptWriter, icon: '/assets/icons/movie.svg', about: t(tokens.form.scriptWriterAbout) },
    { name: t(tokens.headings.recipeWriter), path: paths.dashboard.recipeGen, icon: '/assets/icons/recipe.svg', about: t(tokens.form.recipeWriterAbout) },
    { name: t(tokens.headings.poemGenerator), path: paths.dashboard.poemGenerator, icon: '/assets/icons/poem.svg', about: t(tokens.form.poemGeneratorAbout) },
    { name: t(tokens.headings.seoArticleWriter), path: paths.dashboard.seoArticleWriter, icon: '/assets/icons/seo.svg', about: t(tokens.form.seoArticleWriterAbout) },
    { name: t(tokens.headings.essayWriter), path: paths.dashboard.essayWriter, icon: '/assets/icons/edu.svg', about: t(tokens.form.essayWriterAbout) },
    { name: t(tokens.headings.editor), path: paths.dashboard.editor, icon: '/assets/icons/editor.svg', about: t(tokens.form.editorAbout) },
    { name: t(tokens.headings.dietPlanner), path: paths.dashboard.dietPlanner, icon: '/assets/icons/diet.svg', about: t(tokens.form.dietPlannerAbout) },
    { name: t(tokens.headings.storyGenerator), path: paths.dashboard.storyGenerator, icon: '/assets/icons/edu.svg', about: t(tokens.form.storyGeneratorAbout) },
    { name: t(tokens.headings.dreamInterpretation), path: paths.dashboard.dreamInterpretation, icon: '/assets/icons/dream.svg', about: t(tokens.form.dreamInterpretationAbout) },
    { name: t(tokens.headings.magicMirror), path: paths.dashboard.magicMirror, icon: '/assets/icons/mirror.svg', about: t(tokens.form.magicMirrorAbout) },
    { name: t(tokens.headings.philosophyWriter), path: paths.dashboard.philosophyWriter, icon: '/assets/icons/filoso.svg', about: t(tokens.form.philosophyWriterAbout) },
    { name: t(tokens.headings.interiorDesigner), path: paths.dashboard.interiorDesigner, icon: '/assets/icons/interior.svg', about: t(tokens.form.interiorDesignerAbout) },
    { name: t(tokens.headings.howToMake), path: paths.dashboard.howToMake, icon: '/assets/icons/how.svg', about: t(tokens.form.howToMakeAbout) },
    { name: t(tokens.headings.resumeBuilder), path: paths.dashboard.resumeBuilder, icon: '/assets/icons/resume.svg', about: t(tokens.form.resumeBuilderAbout) },
    { name: t(tokens.headings.speechWriter), path: paths.dashboard.speechWriter, icon: '/assets/icons/speech.svg', about: t(tokens.form.speechWriterAbout) },
    { name: t(tokens.headings.translator), path: paths.dashboard.translator, icon: '/assets/icons/translator.svg', about: t(tokens.form.translatorAbout) },
    { name: t(tokens.headings.careerDeveloper), path: paths.dashboard.careerDeveloper, icon: '/assets/icons/career.svg', about: t(tokens.form.careerDeveloperAbout) },
    { name: t(tokens.headings.startABusiness), path: paths.dashboard.startABusiness, icon: '/assets/icons/business.svg', about: t(tokens.form.startABusinessAbout) },
    { name: t(tokens.headings.investmentAdvisor), path: paths.dashboard.investmentAdvisor, icon: '/assets/icons/invest.svg', about: t(tokens.form.investmentAdvisorAbout) },
    { name: t(tokens.headings.uniAnswers), path: paths.dashboard.uniAnswers, icon: '/assets/icons/uni.svg', about: t(tokens.form.uniAnswersAbout) },
    { name: t(tokens.headings.travelAgent), path: paths.dashboard.travelAgent, icon: '/assets/icons/travel.svg', about: t(tokens.form.travelAgentAbout) },
    { name: t(tokens.headings.cocktailCrafter), path: paths.dashboard.cocktailCrafter, icon: '/assets/icons/cocktail.svg' , about: t(tokens.form.cocktailCrafterAbout) },
    { name: t(tokens.headings.dessertGenerator), path: paths.dashboard.dessertGenerator, icon: '/assets/icons/dessert.svg', about: t(tokens.form.dessertGeneratorAbout) },
    { name: t(tokens.headings.bookSummariser), path: paths.dashboard.bookSummariser, icon: '/assets/icons/book.svg' , about: t(tokens.form.bookSummariserAbout) },
    { name: t(tokens.headings.fruitsNVeges), path: paths.dashboard.fruitsNVeges, icon: '/assets/icons/fruits.svg' , about: t(tokens.form.fruitsNVegesAbout) },

  ];




  // Additional areas

  return (
    <Container sx={{ py: { xs: 5, md: 10, lg: 17 } }}>

      <Typography sx={{ ...typography.h4, mb: 5, mt: 0, pl: 2, pr:0, textAlign: 'left' }}>{t(tokens.form.hello)} {user?.firstName}, {t(tokens.form.todayIs)}</Typography>
      <Typography sx={{ ...typography.h4, mb: 5, mt: 7, textAlign: 'center' }}>
        {t(tokens.headings.AItools)}
      </Typography>

      <Box
        sx={{
          gap: 3,
          paddingLeft: 0,
          display: 'grid',
          my: { xs: 8, md: 10 },
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
        }}
      >
        {modules.map((module) => (
          <ModuleItem key={module.name} module={module} />
        ))}
      </Box>
    </Container>
  );
}

type ModuleItemProps = {
  module: ModuleItem;
};

const ModuleItem = ({ module }: ModuleItemProps) => {
  const router = useRouter();
  const theme = useTheme();
  const [hovered, setHovered] = React.useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <Paper
      onClick={() => router.push(module.path)}
      variant="outlined"
      sx={{
        pt: '100%',
        borderRadius: 2,
        cursor: 'pointer',
        textAlign: 'center',
        position: 'relative',
        bgcolor: hovered ? 'background.paper' : 'transparent', // Change background color on hover
        transition: theme.transitions.create('all'),
        '&:hover': {
          bgcolor: 'background.paper', // Change background color on hover
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
            mb: 1,
            width: 60,
            height: 60,
            mx: 'auto',
            display: 'flex',
            borderRadius: '50%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SvgColor
            src={module.icon}
            color={hovered ? theme.palette.primary.main : 'info'} // Change icon color on hover to primary color
            sx={{
              width: 50,
              height: 50,
            }}
          />
        </Box>

        <Typography sx={{ ...typography.subtitle1, color: 'text.primary', mt: 0, mb: 2 }}>
          {module.name}
        </Typography>

        <Typography sx={{ ...typography.subtitle2, color: 'text.secondary', mt: 0, mb: 0, pl: 2, pr: 2 }}>
          {module.about}
        </Typography>
      </Stack>
    </Paper>
  );
}


Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
