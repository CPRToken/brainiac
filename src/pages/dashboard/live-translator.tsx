//src/pages/dashboard/live-translator.tsx
import type { NextPage } from 'next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import {useTranslation} from "react-i18next";
import {tokens} from "src/locales/tokens";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { usePageView } from 'src/hooks/use-page-view';
import { LiveTranslator } from 'src/sections/components/forms/live-translator';
import { Seo } from 'src/components/seo';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';


const Page: NextPage = () => {
  usePageView();

  const { t } = useTranslation();


  return (
    <>
      <Seo title={t(tokens.form.liveSpeechTranslator)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container
          maxWidth="xl"  // Set the max width to medium (you can use 'sm', 'md', 'lg', etc.)
          sx={{
            mx: 'auto',  // Center the container horizontally
            px: 3       // Optional padding for extra space on the sides
          }}
        >
          <Grid
            container
            justifyContent="center"
            spacing={{
              xs: 3,
              lg: 4,
            }}
          >
            <Grid xs={12}>
              <Stack
                direction="row"
                justifyContent="center"
                spacing={4}
              >
                <div>
                  <Typography
                      variant="h5">{t(tokens.form.liveSpeechTranslator)}</Typography>
                </div>

                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={2}
                >

                </Stack>
              </Stack>
            </Grid>
            <Grid
              xs={12}
              md={8}
              sx={{
                paddingLeft: 2, // Add padding here
                // Or if you prefer margin: marginLeft: 2
              }}
            >
              <Stack
                spacing={{
                  xs: 3,
                  lg: 4,
                }}
              >
                <Box paddingTop={4}>
                  <LiveTranslator />
                </Box>
              </Stack>
            </Grid>

          </Grid>
        </Container>
      </Box>



    </>
  );

};


Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
