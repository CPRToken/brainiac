import React from "react";
import type { NextPage } from 'next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { RouterLink } from 'src/components/router-link';
import  TextMaxLine  from 'src/components/text-max-line/text-max-line';
import Iconify from 'src/components/iconify';
import SvgColor from "src/components/svg-color";
import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';
import {typography } from "src/theme/typography";
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/router';
import { useTranslation } from "react-i18next";
import { usePageView } from 'src/hooks/use-page-view';
import { Seo } from 'src/components/seo';
import {useTheme} from "@mui/material/styles";
import { alpha } from '@mui/system/colorManipulator';
import Paper from '@mui/material/Paper';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { auth } from '../../libs/firebase';
import { paths } from 'src/paths';
import {tokens} from "../../locales/tokens"; // Ensure paths are correctly imported



type ModuleItem = {
  name: string;
  path: string;
  icon: string;
};

const Page: NextPage = () => {
  const { t } = useTranslation();
  useTheme();

const modules: ModuleItem[] = [
  { name: t(tokens.headings.lyricWriter), path: paths.dashboard.lyricWriter, icon: '/assets/icons/lyric.svg' },
  { name: t(tokens.headings.scriptWriter), path: paths.dashboard.scriptWriter, icon: '/assets/icons/movie.svg' },
  { name: t(tokens.headings.recipeWriter), path: paths.dashboard.recipeGen, icon: '/assets/icons/recipe.svg' },
  { name: t(tokens.headings.poemGenerator), path: paths.dashboard.poemGenerator, icon: '/assets/icons/poem.svg' },
  { name: t(tokens.headings.seoArticleWriter), path: paths.dashboard.seoArticleWriter, icon: '/assets/icons/seo.svg' },
  { name: t(tokens.headings.essayWriter), path: paths.dashboard.essayWriter, icon: '/assets/icons/edu.svg' },
  { name: t(tokens.headings.editor), path: paths.dashboard.editor, icon: '/assets/icons/editor.svg' },
  { name: t(tokens.headings.dietPlanner), path: paths.dashboard.dietPlanner, icon: '/assets/icons/diet.svg' },
  { name: t(tokens.headings.storyGenerator), path: paths.dashboard.storyGenerator, icon: '/assets/icons/edu.svg' },
  { name: t(tokens.headings.dreamInterpretation), path: paths.dashboard.dreamInterpretation, icon: '/assets/icons/dream.svg' },
  { name: t(tokens.headings.magicMirror), path: paths.dashboard.magicMirror, icon: '/assets/icons/mirror.svg' },
  { name: t(tokens.headings.philosophyWriter), path: paths.dashboard.philosophyWriter, icon: '/assets/icons/filoso.svg' },
  { name: t(tokens.headings.interiorDesigner), path: paths.dashboard.interiorDesigner, icon: '/assets/icons/interior.svg' },
  { name: t(tokens.headings.howToMake), path: paths.dashboard.howToMake, icon: '/assets/icons/how.svg' },
  { name: t(tokens.headings.resumeBuilder), path: paths.dashboard.resumeBuilder, icon: '/assets/icons/resume.svg' },
  { name: t(tokens.headings.speechWriter), path: paths.dashboard.speechWriter, icon: '/assets/icons/speech.svg' },
  { name: t(tokens.headings.translator), path: paths.dashboard.translator, icon: '/assets/icons/translator.svg' },
  { name: t(tokens.headings.careerDeveloper), path: paths.dashboard.careerDeveloper, icon: '/assets/icons/career.svg' },
  { name: t(tokens.headings.startABusiness), path: paths.dashboard.startABusiness, icon: '/assets/icons/business.svg' },
  { name: t(tokens.headings.investmentAdvisor), path: paths.dashboard.investmentAdvisor, icon: '/assets/icons/invest.svg' },
  { name: t(tokens.headings.uniAnswers), path: paths.dashboard.uniAnswers, icon: '/assets/icons/uni.svg' },
  { name: t(tokens.headings.travelAgent), path: paths.dashboard.travelAgent, icon: '/assets/icons/travel.svg' },
  { name: t(tokens.headings.cocktailCrafter), path: paths.dashboard.cocktailCrafter, icon: '/assets/icons/cocktail.svg' },
  { name: t(tokens.headings.dessertGenerator), path: paths.dashboard.dessertGenerator, icon: '/assets/icons/dessert.svg' },
  { name: t(tokens.headings.bookSummariser), path: paths.dashboard.bookSummariser, icon: '/assets/icons/book.svg' },
  { name: t(tokens.headings.fruitsNVeges), path: paths.dashboard.fruitsNVeges, icon: '/assets/icons/fruits.svg' },
  { name: t(tokens.headings.tweetGenerator), path: paths.dashboard.tweetGenerator, icon: '/assets/icons/tweet.svg' },

];




  // Additional areas


  return (
    <Container sx={{ py: { xs: 5, md: 10, lg: 17 } }}>
      <Typography sx={{ ...typography.h5, mb: 9, mt: 3, textAlign: 'center' }}>
        {t(tokens.headings.AImodules)}
      </Typography>





      <Grid container spacing={3} justifyContent="center">
        {modules.map((module) => (
          <Grid item xs={12} sm={6} md={3} key={module.name} sx={{ textAlign: 'center' }}>
            <IconButton component={RouterLink} href={module.path}>
              <SvgColor src={module.icon} color="info"
                        sx={{ width: 60, height: 60, mx: 'auto', bgcolor: 'primary.main' }} />
            </IconButton>
            <Typography sx={{ ...typography.subtitle1, color: 'text.primary', mt: 3, mb: 3 }}>
              {module.name}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

// ----------------------------------------------------------------------

type ModuleItemProps = {
  service: {
    name: string;
    content: string;
    path: string;
    icon: string;
  };
  index: number;
};

function ModuleItem({ service, index }: ModuleItemProps) {
  const { name, icon, content, path } = service;



  return (
    <Card
      sx={{
        px: 4,
        py: 5,
        textAlign: 'center',
        ...(index === 1 && {
          py: { xs: 5, md: 8 },
        }),
        ...(index === 2 && {
          py: { xs: 5, md: 10 },

        }),
      }}
    >


      <Stack spacing={1} sx={{ my: 5 }}>
        <TextMaxLine variant="h6">{name}</TextMaxLine>
        <TextMaxLine variant="body2" sx={{ color: 'text.secondary' }}>
          {content}
        </TextMaxLine>
      </Stack>

      <IconButton
        component={RouterLink}
        href={path}
        color={
          (index === 0 && 'primary') ||
          (index === 1 && 'secondary') ||
          (index === 2 && 'success') ||
          'warning'
        }
      >
        <Iconify icon="carbon:direction-straight-right" />
      </IconButton>
    </Card>
  );
}




Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
