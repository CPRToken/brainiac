import React, { useEffect, useState } from "react";
import type { NextPage } from 'next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import SvgColor from "src/components/svg-color";
import { socialApi } from "src/api/social/socialApi";
import Typography from '@mui/material/Typography';
import { typography } from "src/theme/typography";
import { useRouter } from 'next/router';
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import Paper from '@mui/material/Paper';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { paths } from 'src/paths';
import { tokens } from "../../locales/tokens";
import type { Profile } from "../../types/social";
import { auth } from "../../libs/firebase"; // Ensure paths are correctly imported

type ModuleItem = {
  name: string;
  path: string;
  role?: string;
  plan?: string[];
  stripeCustomerId?: string;
  icon: string;
  about: string;
};

const Page: NextPage = () => {
  const uid = auth.currentUser?.uid;
  const [user, setUser] = useState<Profile | null>(null);
  const { t } = useTranslation();

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

  const modules: ModuleItem[] = [
    { name: t(tokens.headings.imageGenerator), path: paths.dashboard.imageGenerator, icon: '/assets/icons/images.svg', about: t(tokens.form.imageAbout), plan: ['Trial','Basic','Premium', 'Business', 'BasicYearly', 'PremiumYearly', 'BusinessYearly '] },
    { name: t(tokens.headings.lyricWriter), path: paths.dashboard.lyricWriter, icon: '/assets/icons/lyric.svg', about: t(tokens.form.lyricWriterAbout) , plan: ['Trial','Basic','Premium', 'Business', 'BasicYearly', 'PremiumYearly', 'BusinessYearly '] },
    { name: t(tokens.headings.scriptWriter), path: paths.dashboard.scriptWriter, icon: '/assets/icons/movie.svg', about: t(tokens.form.scriptWriterAbout) , plan: ['Trial','Basic','Premium', 'Business','PremiumYearly', 'BusinessYearly '] },
    { name: t(tokens.headings.recipeWriter), path: paths.dashboard.recipeGen, icon: '/assets/icons/recipe.svg', about: t(tokens.form.recipeWriterAbout) , plan: ['Trial','Premium', 'Business','PremiumYearly', 'BusinessYearly '] },
    { name: t(tokens.headings.poemGenerator), path: paths.dashboard.poemGenerator, icon: '/assets/icons/poem.svg', about: t(tokens.form.poemGeneratorAbout) , plan: ['Trial','Basic','Premium', 'Business','PremiumYearly', 'BusinessYearly '] },
    { name: t(tokens.headings.seoArticleWriter), path: paths.dashboard.seoArticleWriter, icon: '/assets/icons/seo.svg', about: t(tokens.form.seoArticleWriterAbout) , plan: ['Trial','Premium', 'Business'] },
    { name: t(tokens.headings.essayWriter), path: paths.dashboard.essayWriter, icon: '/assets/icons/edu.svg', about: t(tokens.form.essayWriterAbout) , plan: ['Trial','Premium', 'Business','PremiumYearly', 'BusinessYearly '] },
    { name: t(tokens.headings.editor), path: paths.dashboard.editor, icon: '/assets/icons/editor.svg', about: t(tokens.form.editorAbout) , plan: ['Trial','Business'] },
    { name: t(tokens.headings.dietPlanner), path: paths.dashboard.dietPlanner, icon: '/assets/icons/diet.svg', about: t(tokens.form.dietPlannerAbout) , plan: ['Trial','Premium', 'Business','PremiumYearly', 'BusinessYearly '] },
    { name: t(tokens.headings.storyGenerator), path: paths.dashboard.storyGenerator, icon: '/assets/icons/edu.svg', about: t(tokens.form.storyGeneratorAbout) , plan: ['Trial','Premium', 'Business','PremiumYearly', 'BusinessYearly '] },
    { name: t(tokens.headings.dreamInterpretation), path: paths.dashboard.dreamInterpretation, icon: '/assets/icons/dream.svg', about: t(tokens.form.dreamInterpretationAbout) , plan: ['Trial','Premium', 'Business','PremiumYearly', 'BusinessYearly '] },
    { name: t(tokens.headings.magicMirror), path: paths.dashboard.magicMirror, icon: '/assets/icons/mirror.svg', about: t(tokens.form.magicMirrorAbout) , plan: ['Trial','Premium', 'Business','PremiumYearly', 'BusinessYearly '] },
    { name: t(tokens.headings.philosophyWriter), path: paths.dashboard.philosophyWriter, icon: '/assets/icons/filoso.svg', about: t(tokens.form.philosophyWriterAbout) , plan: ['Trial','Premium', 'Business','PremiumYearly', 'BusinessYearly '] },
    { name: t(tokens.headings.interiorDesigner), path: paths.dashboard.interiorDesigner, icon: '/assets/icons/interior.svg', about: t(tokens.form.interiorDesignerAbout) , plan: ['Trial','Premium', 'Business','PremiumYearly', 'BusinessYearly '] },
    { name: t(tokens.headings.howToMake), path: paths.dashboard.howToMake, icon: '/assets/icons/how.svg', about: t(tokens.form.howToMakeAbout) },
    { name: t(tokens.headings.resumeBuilder), path: paths.dashboard.resumeBuilder, icon: '/assets/icons/resume.svg', about: t(tokens.form.resumeBuilderAbout) , plan: ['Trial', 'Premium','Business'] },
    { name: t(tokens.headings.speechWriter), path: paths.dashboard.speechWriter, icon: '/assets/icons/speech.svg', about: t(tokens.form.speechWriterAbout) , plan: ['Trial', 'Premium','Business'] },
    { name: t(tokens.headings.translator), path: paths.dashboard.translator, icon: '/assets/icons/translator.svg', about: t(tokens.form.translatorAbout) , plan: ['Trial','Premium', 'Business'] },
    { name: t(tokens.headings.careerDeveloper), path: paths.dashboard.careerDeveloper, icon: '/assets/icons/career.svg', about: t(tokens.form.careerDeveloperAbout) , plan: ['Trial', 'Business'] },
    { name: t(tokens.headings.startABusiness), path: paths.dashboard.startABusiness, icon: '/assets/icons/business.svg', about: t(tokens.form.startABusinessAbout), plan: ['Trial', 'Business'] },
    { name: t(tokens.headings.investmentAdvisor), path: paths.dashboard.investmentAdvisor, icon: '/assets/icons/invest.svg', about: t(tokens.form.investmentAdvisorAbout) , plan: ['Trial', 'Premium', 'Business'] },
    { name: t(tokens.headings.uniAnswers), path: paths.dashboard.uniAnswers, icon: '/assets/icons/uni.svg', about: t(tokens.form.uniAnswersAbout) , plan: ['Trial','Premium', 'Business'] },
    { name: t(tokens.headings.travelAgent), path: paths.dashboard.travelAgent, icon: '/assets/icons/travel.svg', about: t(tokens.form.travelAgentAbout) , plan: ['Trial','Premium', 'Business'] },
    { name: t(tokens.headings.cocktailCrafter), path: paths.dashboard.cocktailCrafter, icon: '/assets/icons/cocktail.svg', about: t(tokens.form.cocktailCrafterAbout) , plan: ['Trial','Premium', 'Business'] },
    { name: t(tokens.headings.dessertGenerator), path: paths.dashboard.dessertGenerator, icon: '/assets/icons/dessert.svg', about: t(tokens.form.dessertGeneratorAbout) , plan: ['Trial','Premium', 'Business'] },
    { name: t(tokens.headings.bookSummariser), path: paths.dashboard.bookSummariser, icon: '/assets/icons/book.svg', about: t(tokens.form.bookSummariserAbout) , plan: ['Trial','Premium', 'Business'] },
    { name: t(tokens.headings.fruitsNVeges), path: paths.dashboard.fruitsNVeges, icon: '/assets/icons/fruits.svg', about: t(tokens.form.fruitsNVegesAbout) , plan: ['Trial','Premium', 'Business'] },
    { name: t(tokens.headings.biblicalFigures), path: paths.dashboard.biblicalFigures, icon: '/assets/icons/bible.svg', about: t(tokens.form.biblicalFiguresAbout) , plan: ['Trial','Premium', 'Business'] },
    { name: t(tokens.headings.idiomTranslator), path: paths.dashboard.idiomTranslator, icon: '/assets/icons/idioms.svg', about: t(tokens.form.idiomTranslatorAbout) , plan: ['Trial','Premium', 'Business'] },
    { name: t(tokens.headings.Articulate), path: paths.dashboard.articulate, icon: '/assets/icons/articulate.svg', about: t(tokens.form.articulateAbout) , plan: ['Trial','Premium', 'Business'] },
    { name: t(tokens.headings.liveTranslator), path: paths.dashboard.azureTranslator, icon: '/assets/icons/speech.svg', about: t(tokens.form.liveTransAbout) , plan: ['Premium', 'Business'] },
    { name: t(tokens.headings.contractGenerator), path: paths.dashboard.contractGenerator, icon: '/assets/icons/contract.svg', about: t(tokens.form.contractGeneratorAbout) , plan: ['Trial','Premium', 'Business'] },
    { name: t(tokens.headings.contractReader), path: paths.dashboard.contractReader, icon: '/assets/icons/contractreader.svg', about: t(tokens.form.contractReaderAbout) , plan: ['Trial','Premium', 'Business'] },
  ];

  const filteredModules = user ? modules.filter(module => {
    const modulePlans = module.plan ?? [];
    console.log("User Plan:", user.plan); // Debugging
    console.log("Module Plans:", modulePlans); // Debugging
    return (modulePlans.includes(user.plan ?? '') || user.plan === 'Business');
  }) : [];

  return (
    <Container sx={{ py: { xs: 5, md: 10, lg: 17 } }}>
      <Typography sx={{ ...typography.h4, mb: 4, mt: 0, pl: 2, pr: 0, textAlign: 'left' }}>
        {t(tokens.form.hello)} {user?.firstName}, {t(tokens.form.todayIs)}
      </Typography>
      <Typography sx={{ ...typography.h4, mb: 5, mt: 7, textAlign: 'center' }}>
        {user?.plan} plan {t(tokens.headings.AItools)}
      </Typography>

      <Box
        sx={{
          gap: { xs: 2, sm: 2, md: 2, lg: 2 },
          paddingLeft: { xs: 1, sm: 1, md: 1, lg: 3 },
          paddingRight: { xs: 1, sm: 1, md: 1, lg: 3 },
          mt: { xs: 2, sm: 2, md: 1, lg: 1 },
          mb: { xs: 2, sm: 2, md: 1, lg: 1 },
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
        {filteredModules.map((module) => (
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
        pt: '80%',
        width: '100%',
        minHeight: '100px',
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
            width: 60,
            height: 60,
            mx: 'auto',
            display: 'flex',
            borderRadius: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 0, sm: 0, md: 0, lg: 0 },
            pt: { xs: 0, sm: 0 , md: 0, lg: 1 },
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

        <Typography sx={{ ...typography.subtitle1,
          color: 'text.primary',
          mt: { xs: 0, sm: 0 },
          mb: { xs: 0, sm: 0 },
          pl: { xs: 1, sm: 0 },
          pr: { xs: 1, sm: 0 },
        }}>
          {module.name}
        </Typography>

        <Typography sx={{ ...typography.subtitle2,
          color: 'text.secondary',
          mt: { xs: 0, sm: 1 },
          mb: { xs: 1, sm: 1 },
          pl: { xs: 1, sm: 0 , md: 0, lg: 1 },
          pr: { xs: 1, sm: 0 , md: 0, lg: 1 },
        }}>
          {module.about}
        </Typography>
      </Stack>
    </Paper>
  );
}

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
