import type { NextPage } from 'next';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import {useTranslation} from "react-i18next";
import {tokens} from "src/locales/tokens";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { MyContent } from 'src/sections/dashboard/file-manager/my-content';
import { usePageView } from 'src/hooks/use-page-view';
import { StockSelector } from 'src/sections/components/forms/stock-selector';
import { Seo } from 'src/components/seo';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { auth } from '../../libs/firebase';
import Hidden from "@mui/material/Hidden";

const Page: NextPage = () => {
  usePageView();

  const { t } = useTranslation();
  const user = auth.currentUser;
  const uid = user ? user.uid : null;
  const settings = {
    stretch: false // Replace with your actual settings value
  };

  return (
    <>
      <Seo title={t(tokens.headings.stockSelector)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <Grid
            container
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
                      variant="h5">{t(tokens.headings.stockSelector)}</Typography>
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
              md={9}
              sx={{
                paddingLeft: 4, // Add padding here
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
                  <StockSelector />
                </Box>
              </Stack>
            </Grid>
            <Grid
              xs={12}
              md={4} // Changed from 4 to 3 for skinnier My Content
              sx={{ paddingLeft: 2 }}
            >

            </Grid>
          </Grid>
        </Container>
      </Box>



    </>
  );

};


Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
