import type { FC } from 'react';

import Box from '@mui/material/Box';

import Container from '@mui/material/Container';
import {useTranslation} from "react-i18next";
import Stack from '@mui/material/Stack';

import Typography from '@mui/material/Typography';
import {typography } from "src/theme/typography";
import { useTheme } from '@mui/material/styles';
import {tokens} from "src/locales/tokens";



export const HomeHero: FC = () => {
  const theme = useTheme();  // Use the theme

  const { t } = useTranslation();


    return (
      <Box
          sx={{
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top center',
            backgroundSize: 'cover',
            backgroundImage: theme.palette.mode === 'dark'
              ? 'linear-gradient(rgba(0, 0, 139, 0.20), rgba(0, 0, 139, 0.3)), url("/assets/ai-dark.png")'
              : 'linear-gradient(rgba(255, 255, 255, 0.60), rgba(255, 255, 255, 0.3)), url("/assets/ai-light.png")',
            pt: '40px',
            pb: '10px',
            height: '70vh', // Default to 70% of the viewport height
            width: 'cover',
            '@media (max-width:600px)': {
              height: '50vh', // Adjust height for xs screens

            },
            '@media (min-width:600px) and (max-width:899px)': {

            },

          }}
      >
          <Container maxWidth="lg">
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',

                pt: { xs: 0, sm: 2, md: 6, lg: 8 }, // Example padding top values for different sizes
                pb: { xs: 0, sm: 2, md: 3, lg: 4 }, // Example padding bottom values for different sizes
              }}
            >
                <Typography sx={{ ...typography.h2, color: 'text.primary', mt: 12, mb: 0 }}>
                    {t(tokens.headings.Heading)}
                </Typography>
                      <Typography
                          component="span"
                          color="primary.main"
                          variant="inherit"

                      ><br />

                      </Typography>  <br />


                  <Typography
                      color="text.primary"
                      sx={{
                          fontSize: { xs: '1.2rem', sm: '1.2rem' },  // Change these sizes as needed
                          fontWeight: 500,
                      }}
                  >
                      {/* eslint-disable-next-line react/no-unescaped-entities */}

          </Typography>
          <Stack
            alignItems="center"
            direction="row"
            flexWrap="wrap"
            spacing={1}
            sx={{ my: 2 }}
          >



          </Stack>

        </Box>

      </Container>
    </Box>
  );
};
