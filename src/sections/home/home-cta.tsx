import type { FC } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
 import Typography from '@mui/material/Typography';
import { useTranslation } from "react-i18next";

import { typography } from "../../theme/typography";
import { tokens } from "../../locales/tokens";

export const HomeCta: FC = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
        backgroundImage: 'url("/assets/gradient-bg.svg")',
        pt: '60px',
        pb: '100px',
      }}
    >
      <Container maxWidth="lg">
        <Box maxWidth="sm" sx={{ mx: 'auto', textAlign: 'center' }}>
          <Typography
            sx={{
              ...typography.h4,
              pb: 2,
              mb: { xs: 1, sm: 2, md: 3, lg: 2 }, // Responsive margin-bottom
              mt: { xs: 0, sm: 2, md: 3, lg: 4 }, // Responsive margin-top
            }}
          >
            {t(tokens.form.HowitWorks)}
          </Typography>

          <Typography
            sx={{
              ...typography.body1,


            }}
          >
            {t(tokens.form.HowitWorksParagraph)}
          </Typography>

        </Box>

        <Grid container spacing={3} sx={{ mt: 5 }}>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            sx={{
              display: 'flex',
              justifyContent: {
                xs: 'center', // Center video for xs screens
                md: 'flex-start', // Default for md and above
              },
            }}
          >
            <Box
              sx={{
                width: {
                  xs: '70%',
                  sm: '80%',
                  md: '85%',
                  lg: '90%',
                },
              }}
            >
              <video width="100%" controls>
                <source src={t(tokens.form.video1)} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            sx={{
              display: 'flex',
              justifyContent: {
                xs: 'center',
                md: 'flex-start',
              },
            }}
          >
            <Box
              sx={{
                width: {
                  xs: '70%',
                  sm: '80%',
                  md: '85%',
                  lg: '90%',
                },
              }}
            >
              <video width="100%" controls>
                <source src={t(tokens.form.video2)} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            sx={{
              display: 'flex',
              justifyContent: {
                xs: 'center',
                md: 'flex-start',
              },
            }}
          >
            <Box
              sx={{
                width: {
                  xs: '70%',
                  sm: '80%',
                  md: '85%',
                  lg: '90%',
                },
              }}
            >
              <video width="100%" controls>
                <source src={t(tokens.form.video3)} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Box>
          </Grid>
        </Grid>



      </Container>
    </Box>
  );
};
