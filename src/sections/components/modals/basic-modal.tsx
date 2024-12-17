import type { FC } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { useTranslation } from "react-i18next";
import { tokens } from "src/locales/tokens";
import { paths } from 'src/paths';

type ModuleItem = {
  name: string;
  path: string;
  icon: string;
  about: string;
};

export const BasicModal: FC = () => {
  const { t } = useTranslation(); // This must be inside the function body

  const basicPackageModules: ModuleItem[] = [
    { name: t(tokens.headings.imageGenerator), path: paths.dashboard.imageGenerator, icon: '/assets/icons/images.svg', about: t(tokens.form.imageAbout) },
    { name: t(tokens.headings.lyricWriter), path: paths.dashboard.lyricWriter, icon: '/assets/icons/lyric.svg', about: t(tokens.form.lyricWriterAbout) },
    { name: t(tokens.headings.seoArticleWriter), path: paths.dashboard.seoArticleWriter, icon: '/assets/icons/seo.svg', about: t(tokens.form.seoArticleWriterAbout) },
    { name: t(tokens.headings.poemGenerator), path: paths.dashboard.poemGenerator, icon: '/assets/icons/poem.svg', about: t(tokens.form.poemGeneratorAbout) },
    { name: t(tokens.headings.dreamInterpretation), path: paths.dashboard.dreamInterpretation, icon: '/assets/icons/dream.svg', about: t(tokens.form.dreamInterpretationAbout) },
  ];

  return (
    <Box
      sx={{
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.100'),
        p: 3,
      }}
    >
      <Paper
        elevation={12}
        sx={{
          maxWidth: 320,
          mx: 'auto',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Basic Package Modules</Typography>
        </Box>
        <List disablePadding>
          {basicPackageModules.map((module) => (
            <ListItem key={module.name}>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                  }}
                >
                  <SvgIcon>{/* Add the actual SVG component or image here */}</SvgIcon>
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Link
                    color="text.primary"
                    sx={{ cursor: 'pointer' }}
                    underline="none"
                    variant="subtitle2"
                  >
                    {module.name}
                  </Link>
                }
                secondary={module.about}
              />
            </ListItem>
          ))}
        </List>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            p: 1,
          }}
        >
          <Button size="small">Mark all as read</Button>
        </Box>
      </Paper>
    </Box>
  );
};
