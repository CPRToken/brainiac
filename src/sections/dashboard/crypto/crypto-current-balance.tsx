import type { FC } from 'react';
import PropTypes from 'prop-types';
import type { ApexOptions } from 'apexcharts';
import numeral from 'numeral';
import TrendUp02Icon from '@untitled-ui/icons-react/build/esm/TrendUp02';
import TrendDown02Icon from '@untitled-ui/icons-react/build/esm/TrendDown02';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { Chart } from 'src/components/chart';
import {tokens} from "../../../locales/tokens";

const useChartOptions = (labels: string[]): ApexOptions => {
  const theme = useTheme();


  return {
    chart: {
      background: 'transparent',
    },
    colors: [theme.palette.primary.main, theme.palette.info.main, theme.palette.warning.main],
    dataLabels: {
      enabled: false,
    },
    grid: {
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    labels,
    legend: {
      show: false,
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
      },
      radialBar: {
        dataLabels: {
          show: false,
        },
        hollow: {
          size: '100%',
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
    stroke: {
      width: 0,
    },
    theme: {
      mode: theme.palette.mode,
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter(value: number): string {
          // Updated to show percentage
          return `${value.toFixed(2)}%`;
        },
      },
    },
  };
};

type ChartSeries = number[];

interface CryptoCurrentBalanceProp {
  chartSeries: ChartSeries;
  labels: string[];
}

export const CryptoCurrentBalance: FC<CryptoCurrentBalanceProp> = (props) => {
  const { chartSeries, labels } = props;
  const chartOptions = useChartOptions(labels);
  const totalAmount = chartSeries.reduce((acc, item) => (acc += item), 0);

  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader
        title={t(tokens.headings.overallHealth)}
        subheader="Balance across all your accounts"
      />
      <CardContent>
        <Stack
          alignItems="center"
          direction="row"
          flexWrap="wrap"
          spacing={3}
        >
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              height: 200,
              justifyContent: 'center',
              width: 200,
            }}
          >
            <Chart
              height={200}
              options={chartOptions}
              series={chartSeries}
              type="donut"
            />
          </Box>
          <Stack
            spacing={4}
            sx={{ flexGrow: 1 }}
          >
            <Stack spacing={1}>
              <Typography
                color="text.secondary"
                variant="overline"
              >
                Total balance
              </Typography>

            </Stack>
            <Stack spacing={1}>
              <Typography
                color="text.secondary"
                variant="overline"
              >
                Percentages
              </Typography>
              <Stack
                component="ul"
                spacing={1}
                sx={{
                  listStyle: 'none',
                  m: 0,
                  p: 0,
                }}
              >
                {chartSeries.map((item, index) => {
                  const amount = numeral(item).format('$0,0.00');

                  return (
                    <Stack
                      alignItems="center"
                      component="li"
                      direction="row"
                      key={index}
                      spacing={2}
                    >
                      <Box
                        sx={{
                          backgroundColor: chartOptions.colors![index],
                          borderRadius: '4px',
                          height: 16,
                          width: 16,
                        }}
                      />
                      <Typography
                        sx={{ flexGrow: 1 }}
                        variant="subtitle2"
                      >
                        {labels[index]}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        variant="subtitle2"
                      >
                        {amount}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          color="inherit"
          endIcon={
            <SvgIcon fontSize="small">
              <TrendUp02Icon />
            </SvgIcon>
          }
          size="small"
        >
          Add funds
        </Button>
        <Button
          color="inherit"
          endIcon={
            <SvgIcon fontSize="small">
              <TrendDown02Icon />
            </SvgIcon>
          }
          size="small"
        >
          Transfer funds
        </Button>
      </CardActions>
    </Card>
  );
};

CryptoCurrentBalance.propTypes = {
  chartSeries: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
};
