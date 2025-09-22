import type { FC } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {useTranslation} from "react-i18next";
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/router';

import Typography from '@mui/material/Typography';
import {typography } from "src/theme/typography";
import { useTheme } from '@mui/material/styles';
import {tokens} from "src/locales/tokens";



export const HomeHero: FC = () => {
  const theme = useTheme();  // Use the theme
  const router = useRouter();

  const { t } = useTranslation();


    return (
      <Box
          sx={{
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top center',
            backgroundSize: 'cover',
            backgroundImage: theme.palette.mode === 'dark'
              ? 'linear-gradient(rgba(0, 0, 139, 0.10), rgba(0, 0, 139, 0.2)), url("/assets/ai-dark.png")'
              : 'linear-gradient(rgba(255, 255, 255, 0.60), rgba(255, 255, 255, 0.3)), url("/assets/ailight.png")',
            pt: '40px',
            pb: '10px',
            height: '57vh', // Default to 70% of the viewport height
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
              pt: { xs: 0, sm: 0, md: 4, lg: 5 },
              pb: { xs: 1, sm: 2, md: 3, lg: 4 },
            }}
          >
            <Stack
              direction={{ xs: 'column', lg: 'row' }}  // Single column for xs to md, row for lg and xl
              justifyContent="space-between"
              textAlign={{ xs: 'center', lg: 'left' }}  // Center text on xs to md, left on lg and xl
              spacing={2}
              sx={{
                my: 2,
                width: '100%'
              }}
            >
              {/* Column 1 */}
              <Box
                sx={{
                  width: { xs: '100%', md: '48%', lg: '48%' },  // Full width on xs to md, 48% on lg and xl
                  mt: { xs: 3, sm: 2, md: 1, lg: 2 },  // Adjust margin-top for mobile, remove for lg and xl
                  pt:{ xs: 2, sm: 2, md: 1,  lg: 2 },

                }}
              >
                <Typography
                  sx={{
                    ...typography.h4,
                    color: 'text.primary',
                    mt: { xs: 3,  md: 3, lg: 3 },  // Adjust top margin for mobile
                    pt: { xs: 3, lg: 2 },
                    mb: 0
                  }}
                >
                  {t(tokens.headings.Heading)}
                </Typography>


                <Typography
                  sx={{
                    ...typography.body1,
                    color: 'text.primary',
                    mt: { xs: 2, sm: 4 },  // Adjust top margin for mobile
                    pt: 4,
                    mb: 4
                  }}
                >
                  {t(tokens.form.BrainiacIntro)}
                </Typography>

                <Button
                  variant="contained"
                  onClick={() => router.push('/pricing')}
                  sx={{
                    width: '50%' }}   // half of the parent container width
                >
                  {t(tokens.form.startFreeTrial)}
                </Button>

              </Box>

              {/* Column 2 */}
              <Box sx={{
                width: '48%' }}>  {/* Adjusted to 48% for better spacing */}
                {/* Your content for the second column */}
              </Box>
            </Stack>
          </Box>
        </Container>


      </Box>
  );
};
