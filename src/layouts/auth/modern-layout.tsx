import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/components/router-link';
import { paths } from 'src/paths';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = (props) => {
  const { children } = props;

  const theme = useTheme();

  // Dynamic logo based on theme mode
  const logoSrc =
    theme.palette.mode === 'dark'
      ? '/assets/logos/logo-dark.svg'
      : '/assets/logos/logo-light.svg';

  // Dynamic background image based on theme mode
  const bgImage =
    theme.palette.mode === 'dark'
      ? '/assets/ai-darkbg.png'
      : '/assets/ai-lightbg.png';

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: {
          xs: 'column-reverse',
          md: 'row',
        },
      }}
    >
      {/* Left Section with Background Image */}
      <Box
        sx={{
          alignItems: 'center',
          backgroundColor: 'neutral.800',
          backgroundImage: theme.palette.mode === 'dark'
            ? `
          linear-gradient(rgba(10, 10, 50, 0.45), rgba(10, 10, 50, 0.30)),
          linear-gradient(rgba(0, 0, 0, 0.20), rgba(0, 0, 0, 0.15)),
          url(${bgImage})`
            : `
          linear-gradient(rgba(255, 255, 255, 0.50), rgba(245, 245, 245, 0.30)),
          linear-gradient(rgba(200, 200, 200, 0.25), rgba(200, 200, 200, 0.35)),
          url(${bgImage})`,
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          color: 'common.white',
          display: 'flex',
          flex: {
            xs: '0 0 auto',
            md: '1 1 auto',
            lg: '1 1 50%',
          },
          justifyContent: 'center',
          p: {
            xs: 4,
            md: 8,
            lg: 10,
          },
        }}
      >
        <Box maxWidth="md">
          {/* Add content specific to the background section here if needed */}
        </Box>
      </Box>

      {/* Right Section with Content and Logo */}
      <Box
        sx={{
          backgroundColor: 'background.paper',
          display: 'flex',
          flex: {
            xs: '1 1 auto',
            md: '0 0 auto',
          },
          flexDirection: 'column',
          justifyContent: {
            md: 'center',
          },
          maxWidth: '100%',
          p: {
            xs: 4,
            md: 8,
          },
          width: {
            xs: 690,
            md: 650,
          },
        }}
      >
        <div>
          {/* Logo Section */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <Stack
              alignItems="center"
              component={RouterLink}
              direction="row"
              display="inline-flex"
              href={paths.index}
              spacing={1}
              sx={{ textDecoration: 'none' }}
            >
              <Box
                component="img"
                src={logoSrc}
                alt="Logo"
                sx={{
                  display: 'inline-flex',
                  height: 50,
                  width: 50,
                }}
              />
              <Box
                sx={{
                  color: 'text.primary',
                  fontFamily: 'inherit',
                  fontSize: { xs: 25, md: 27 },
                  fontWeight: { xs: 450, md: 500 },
                  letterSpacing: '0.4px',
                  lineHeight: 2.5,
                  '& span': {
                    color: 'primary.main',
                  },
                }}
              >
                Brainiac <span>Media</span>
              </Box>
            </Stack>
          </Box>

          {/* Children Content */}
          {children}
        </div>
      </Box>
    </Box>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};
