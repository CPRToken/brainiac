import type { FC } from 'react';
import type { ApexOptions } from 'apexcharts';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { Chart } from 'src/components/chart';
import {tokens} from "../../../locales/tokens";

type ChartSeries = number[];

const chartSeries: ChartSeries = [83];

const useChartOptions = (): ApexOptions => {
  const theme = useTheme();
  const { t } = useTranslation();

  return {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: [theme.palette.primary.main],
    fill: {
      opacity: 1,
      type: 'solid',
    },
    labels: [t(tokens.form.freeTrial)],

    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            color: theme.palette.text.primary,
            fontFamily: theme.typography.fontFamily,
          },
          value: {
            color: theme.palette.text.secondary,
          },
        },
        hollow: {
          size: '60%',
        },
        track: {

        },
      },
    },
    states: {
      active: {
        filter: {
          type: 'none',
        },
      },
      hover: {
        filter: {
          type: 'none',
        },
      },
    },
    theme: {
      mode: theme.palette.mode,
    },
  };
};

export const Chart3: FC = () => {
  const chartOptions = useChartOptions();

  return (
    <Box
      sx={{
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.transparent' : 'neutral.100'),
        p: 3,
      }}
    >
      <Container maxWidth="sm">
         <Card
          sx={{
          boxShadow: 'none', // Remove the shadow around the card
        }}
          >
          <CardContent>
            <Chart
              height={250}
              options={chartOptions}
              series={chartSeries}
              type="radialBar"
            />

          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
