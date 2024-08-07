import type { FC } from 'react';
import EyeIcon from '@untitled-ui/icons-react/build/esm/Eye';
import LayoutBottomIcon from '@untitled-ui/icons-react/build/esm/LayoutBottom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/components/router-link';
import { paths } from 'src/paths';

import { HomeCodeSamples } from './home-code-samples';

export const HomeLoser: FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
        backgroundImage: 'url("/assets/gradient-bg.svg")',
        pt: '120px',
      }}
    >
      <Container maxWidth="lg">
        <Box maxWidth="sm">
          <Typography
            variant="h2"
            sx={{ mb: 2 }}
          >
            Let us worry about the&nbsp;
            <Typography
              component="span"
              color="primary.main"
              variant="inherit"
            >
              User Experience
            </Typography>
            , you focus on Developing.
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              fontSize: 20,
              fontWeight: 500,
            }}
          >
            A professional kit that comes with ready-to-use MUI components developed with one common
            goal in mind, help you build faster & beautiful applications.
          </Typography>
          <Stack
            alignItems="center"
            direction="row"
            flexWrap="wrap"
            spacing={1}
            sx={{ my: 3 }}
          >
            <Rating
              readOnly
              value={4.7}
              precision={0.1}
              max={5}
            />
            <Typography
              color="text.primary"
              variant="caption"
              sx={{ fontWeight: 700 }}
            >
              4.7/5
            </Typography>
            <Typography
              color="text.secondary"
              variant="caption"
            >
              based on (70+ reviews)
            </Typography>
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            <Button
              component={RouterLink}
              href={paths.dashboard.index}
              startIcon={
                <SvgIcon fontSize="small">
                  <EyeIcon />
                </SvgIcon>
              }
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
              variant="contained"
            >
              Live Demo
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              href={paths.components.index}
              startIcon={
                <SvgIcon fontSize="small">
                  <LayoutBottomIcon />
                </SvgIcon>
              }
            >
              Components
            </Button>
          </Stack>
        </Box>
        <Box
          sx={{
            pt: '120px',
            position: 'relative',
          }}
        >




        </Box>
      </Container>
    </Box>
  );
};
