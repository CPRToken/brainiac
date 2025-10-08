import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { styled, useTheme } from '@mui/material/styles';

import { Logo } from 'src/components/logo';
import { RouterLink } from 'src/components/router-link';
import { paths } from 'src/paths';

const TOP_NAV_HEIGHT = 64;

const LayoutRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'top center',
  backgroundImage: 'url("/assets/gradient-bg.svg")',
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  height: '100%',
}));

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = (props) => {
  const { children } = props;

  const theme = useTheme();

  const logoSrc =
    theme.palette.mode === 'dark'
      ? '/assets/logos/logo-dark.svg'
      : '/assets/logos/logo-light.svg';

  return (
    <LayoutRoot>
      <Box
        component="header"
        sx={{
          left: 0,
          position: 'fixed',
          right: 0,
          top: 0,
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            spacing={2}
            sx={{ height: TOP_NAV_HEIGHT }}
          >
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
          </Stack>
        </Container>
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          flex: '1 1 auto',
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            py: {
              xs: '60px',
              md: '120px',
            },
          }}
        >
          {children}
        </Container>
      </Box>
    </LayoutRoot>
  );
};

Layout.propTypes = {

};
