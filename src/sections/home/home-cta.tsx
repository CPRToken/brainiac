import type { FC } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

import { typography } from 'src/theme/typography';
import { tokens } from 'src/locales/tokens';

export const HomeCta: FC = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ backgroundImage: 'url("/assets/gradient-bg.svg")', pt: 8, pb: 12 }}>
      <Container maxWidth="lg">
        <Box maxWidth="sm" sx={{ mx: 'auto', textAlign: 'center' }}>
          <Typography sx={{ ...typography.h4, pb: 2 }}>
            {t(tokens.form.HowitWorks)}
          </Typography>
          <Typography sx={{ ...typography.body1 }}>{t(tokens.form.HowitWorksParagraph)}</Typography>
        </Box>


        <Grid container spacing={3} sx={{ mt: 6 }}>
          {['video1', 'video2', 'video3'].map((v, idx) => (
            <Grid item xs={12} sm={6} md={4} key={v} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Box sx={{ height: { xs: '70%', sm: '80%', md: '85%', lg: '90%' } }}>
                <video width="100%" controls poster={`/assets/videos/vid${idx + 1}.jpg`} preload="none">
                  <source src={t(tokens.form[v as keyof typeof tokens.form])} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

