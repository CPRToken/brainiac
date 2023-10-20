import { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { blogApi } from 'src/api/blog';
import { BreadcrumbsSeparator } from 'src/components/breadcrumbs-separator';
import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { useMounted } from 'src/hooks/use-mounted';
import { usePageView } from 'src/hooks/use-page-view';

import { paths } from 'src/paths';
import { PostCard } from 'src/sections/dashboard/blog/post-card';
import type { Caps } from 'src/types/caps';

export const useCaps = (): Caps[] => {
  const isMounted = useMounted();

    const [caps, setCaps] = useState<Caps[]>([]);

  const handlePostsGet = useCallback(async () => {
    try {
      const response = await blogApi.getCaps();

      if (isMounted()) {
        setCaps(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      handlePostsGet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return caps;
};

const Page: NextPage = () => {
    const caps = useCaps();




    usePageView();

  return (
    <>
      <Seo title="Blog: Post List" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={1}>
            <Typography variant="h3">Capsulas</Typography>
            <Breadcrumbs separator={<BreadcrumbsSeparator />}>
              <Link
                color="text.primary"
                component={RouterLink}
                href={paths.dashboard.index}
                variant="subtitle2"
              >
                Dashboard
              </Link>
              <Link
                color="text.primary"
                component={RouterLink}
                href={paths.dashboard.capsules.index}
                variant="subtitle2"
              >
                Blog
              </Link>
              <Typography
                color="text.secondary"
                variant="subtitle2"
              >
                List
              </Typography>
            </Breadcrumbs>
          </Stack>
          <Card
            elevation={16}
            sx={{
              alignItems: 'center',
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'space-between',
              mb: 8,
              mt: 6,
              px: 3,
              py: 2,
            }}
          >
            <Typography variant="subtitle1">Hace una Capsula </Typography>
            <Button
              component={RouterLink}
              href={paths.dashboard.capsules.postCreate}
              variant="contained"
            >
              Nueva Capsula
            </Button>
          </Card>
          <Typography variant="h5">Capsulas Conmemorativas</Typography>
          <Typography
            color="text.secondary"
            sx={{ mt: 2 }}
            variant="body1"
          >
            Featured Capsules
          </Typography>
          <Typography
            color="text.secondary"
            variant="body1"
          >
            Make
          </Typography>
          <Divider sx={{ my: 4 }} />
          <Grid
            container
            spacing={4}
          >
            {caps.map((caps) => (
              <Grid
                key={caps.name}
                xs={12}
                md={4}
              >
                <PostCard
                  avatar={caps.avatar}
                  name={caps.name}
                  cover={caps.cover}
                  dob={caps.dob}
                  quote={caps.quote}
                  gender={caps.gender}
                  sx={{ height: '100%' }}
                />
              </Grid>
            ))}
          </Grid>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="center"
            spacing={1}
            sx={{
              mt: 4,
              mb: 8,
            }}
          >
            <Button
              disabled
              startIcon={
                <SvgIcon>
                  <ArrowLeftIcon />
                </SvgIcon>
              }
            >
              Newer
            </Button>
            <Button
              endIcon={
                <SvgIcon>
                  <ArrowRightIcon />
                </SvgIcon>
              }
            >
              Older caps
            </Button>
          </Stack>
          <Box sx={{ mt: 8 }}>

          </Box>
        </Container>
      </Box>
    </>
  );
};



export default Page;
