import type { FC } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from "react-i18next";
import { useTheme } from '@mui/material/styles';
import { typography } from "../../theme/typography";
import { tokens } from "../../locales/tokens";

export const HomeCta: FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
        backgroundImage: 'url("/assets/gradient-bg.svg")',
        pt: '120px',
        pb: '120px',
      }}
    >
      <Container maxWidth="lg">
        <Box maxWidth="sm" sx={{ mx: 'auto', textAlign: 'center' }}>
          <Typography
            sx={{
              ...typography.h3,
              pb: 2,

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
          <Grid item xs={12} md={4}>
            <video width="100%" controls>
              <source src={t(tokens.form.video1)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Grid>
          <Grid item xs={12} md={4}>
            <video width="100%" controls>
              <source src={t(tokens.form.video2)} type="video/mp4"/>
              Your browser does not support the video tag.
            </video>
          </Grid>
          <Grid item xs={12} md={4}>
            <video width="100%" controls>
              <source src={t(tokens.form.video3)} type="video/mp4"/>
              Your browser does not support the video tag.
            </video>
          </Grid>
        </Grid>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 6, pt: 6,
          }}
        >
          <Button
            component="a"
            href="/auth/firebase/register"
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
            <Typography sx={{ ...typography.body1, color: 'text.primary', textAlign: 'center', textDecoration: 'none'  }}>   {t(tokens.nav.startFreeTrial)}
            </Typography>
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
