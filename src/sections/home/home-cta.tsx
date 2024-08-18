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
            variant="h2"
            sx={{ mb: 2 }}
          >
            {t(tokens.form.HowitWorks)}
          </Typography>

        </Box>

        <Grid container spacing={3} sx={{ mt: 5 }}>
          <Grid item xs={12} md={4}>
            <video width="100%" controls>
              <source src="/assets/videos/hiphop.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Grid>
          <Grid item xs={12} md={4}>
            <video width="100%" controls>
              <source src="video2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Grid>
          <Grid item xs={12} md={4}>
            <video width="100%" controls>
              <source src="video3.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Grid>
        </Grid>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 6,
          }}
        >
          <Button
            href="/auth/firebase/register"
            variant="contained"
            sx={(theme) =>
              theme.palette.mode === 'dark'
                ? {
                  backgroundColor: 'neutral.50',
                  color: 'neutral.900',
                  '&:hover': {
                    backgroundColor: 'neutral.200',
                  },
                }
                : {
                  backgroundColor: 'neutral.900',
                  color: 'neutral.50',
                  '&:hover': {
                    backgroundColor: 'neutral.700',
                  },
                }
            }
          >
            {t(tokens.nav.startFreeTrial)}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
