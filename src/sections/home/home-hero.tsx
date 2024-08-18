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
              ? 'linear-gradient(rgba(0, 0, 139, 0.10), rgba(0, 0, 139, 0.2)), url("/assets/ai-dark.png")'
              : 'linear-gradient(rgba(255, 255, 255, 0.60), rgba(255, 255, 255, 0.3)), url("/assets/ailight.png")',
            pt: '40px',
            pb: '10px',
            height: '60vh', // Default to 70% of the viewport height
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
              pt: { xs: 0, sm: 2, md: 6, lg: 8 },
              pb: { xs: 0, sm: 2, md: 3, lg: 4 },
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"  // Spread the columns evenly
              spacing={2}
              sx={{ my: 2, width: '100%' }}  // Ensure Stack takes full width
            >
              {/* Column 1 */}
              <Box sx={{ width: '48%' }}>  {/* Adjusted to 48% for better spacing */}
                <Typography
                  sx={{ ...typography.h4, color: 'text.primary', mt: 5, pt: 2, mb: 0 }}
                >
                  {t(tokens.headings.Heading)}
                </Typography>
                <Typography
                  sx={{ ...typography.body1, color: 'text.primary', mt: 5, pt: 2, mb: 0 }}
                >
                  {t(tokens.form.BrainiacIntro)}
                </Typography>
              </Box>

              {/* Column 2 */}
              <Box sx={{ width: '48%' }}>  {/* Adjusted to 48% for better spacing */}
                {/* Your content for the second column */}
              </Box>
            </Stack>
          </Box>
        </Container>


      </Box>
  );
};
