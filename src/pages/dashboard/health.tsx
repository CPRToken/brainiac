import type { NextPage } from 'next';
import { subDays, subHours, subMinutes } from 'date-fns';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { CryptoCards } from 'src/sections/dashboard/crypto/crypto-cards';
import { CryptoOperation } from 'src/sections/dashboard/crypto/crypto-operation';
import { WeightLoss } from 'src/sections/dashboard/health/weight-loss';
import { CryptoTransactions } from 'src/sections/dashboard/crypto/crypto-transactions';
import { Goals } from 'src/sections/dashboard/crypto/goals';
import { CryptoUpgrade } from 'src/sections/dashboard/crypto/crypto-upgrade';
import { CryptoCurrentBalance } from 'src/sections/dashboard/crypto/crypto-current-balance';
import {tokens} from "../../locales/tokens";

const now = new Date();

const Page: NextPage = () => {
  const settings = useSettings();
  const theme = useTheme();
  const { t } = useTranslation();

  usePageView();

  return (
    <>
      <Seo title={t(tokens.headings.health)} />
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
            disableEqualOverflow
            spacing={{
              xs: 3,
              lg: 4,
            }}
          >
            <Grid xs={12}>
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={4}
              >
                <div>
                  <Typography
                    variant="h4">{t(tokens.headings.health)}</Typography>
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
              md={7}
            >
              <Stack
                direction="row"
                spacing={3}
              >
                <WeightLoss
                  chartColor={theme.palette.primary.main}
                  chartSeries={[
                    {
                      name: 'CALS',
                      data: [
                        56, 61, 64, 60, 63, 61, 60, 68, 66, 64, 77, 60, 65, 51, 72, 80, 74, 67, 77,
                        83, 94, 95, 89, 100, 94, 104, 101, 105, 104, 103, 107, 120,
                      ],
                    },
                  ]}
                  kilos={0.7568}

                  rate={0.56}
                  sx={{ flexBasis: '50%' }}
                  calories={16213.2}
                />
                <WeightLoss
                  chartColor={theme.palette.info.main}
                  chartSeries={[
                    {
                      name: 'ETH',
                      data: [
                        65, 64, 32, 45, 54, 76, 82, 80, 85, 78, 82, 95, 93, 80, 112, 102, 105, 95,
                        98, 102, 104, 99, 101, 100, 109, 106, 111, 105, 108, 112, 108, 111,
                      ],
                    },
                  ]}
                  kilos={2045}

                  rate={-0.32}
                  sx={{ flexBasis: '50%' }}
                  calories={96268}
                />
              </Stack>
            </Grid>
            <Grid
              xs={12}
              md={5}
            >

            </Grid>
            <Grid
              xs={12}
              md={8}
            >
              <Stack
                spacing={{
                  xs: 3,
                  lg: 4,
                }}
              >
                <CryptoCurrentBalance
                  chartSeries={[16213.2, 9626.8, 10076.81]}
                  labels={['Bitcoin', 'Ethereum', 'US Dollars']}
                />
                <Goals
                  transactions={[
                    {
                      id: '2',
                      calories: 350,
                      weight: 95,
                      goal: 'lose weight',
                      commencementDate: subDays(subHours(subMinutes(now, 43), 5), 3).getTime(),
                      completionDate: subDays(subHours(subMinutes(now, 43), 5), 3).getTime(),
                      operation: 'add',
                      title: 'Lose Weight',
                    },
                    {
                      id: '2',
                      calories: 200,
                      weight: 80,
                      goal: 'make money',
                      commencementDate: subDays(subHours(subMinutes(now, 43), 5), 3).getTime(),
                      completionDate: subDays(subHours(subMinutes(now, 43), 5), 3).getTime(),
                      operation: 'sub',
                      title: 'Make Money',
                    },

                  ]}
                />
              </Stack>
            </Grid>
            <Grid
              xs={12}
              md={4}
            >
              <Stack
                spacing={{
                  xs: 3,
                  lg: 4,
                }}
              >
                <CryptoOperation />
                <CryptoUpgrade />
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
