import type { FC } from 'react';
import PropTypes from 'prop-types';
import type { ApexOptions } from 'apexcharts';
import numeral from 'numeral';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import ChevronUpIcon from '@untitled-ui/icons-react/build/esm/ChevronUp';
import DotsHorizontalIcon from '@untitled-ui/icons-react/build/esm/DotsHorizontal';
import type { SxProps } from '@mui/system/styleFunctionSx';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { Chart } from 'src/components/chart';

const logoMap: Record<string, string> = {
  BTC: '/assets/icons/ic_money.svg',
  ETH: '/assets/icons/cals2.svg',
  BNB: '/assets/logos/cals.svg',
  CALS: '/assets/icons/cals2.svg',
};

const useChartOptions = (color: string): ApexOptions => {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: [color],
    dataLabels: {
      enabled: false,
    },
    fill: {
      gradient: {
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 100],
      },
      type: 'gradient',
    },
    grid: {
      show: false,
      padding: {
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
      },
    },
    stroke: {
      width: 2,
    },
    theme: {
      mode: theme.palette.mode,
    },
    tooltip: {
      enabled: false,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
  };
};

type ChartSeries = {
  name: string;
  data: number[];
}[];

interface CryptoWalletProps {
  chartColor: string;
  chartSeries: ChartSeries;
  coinAmount: number;
  currency: string;
  rate: number;
  sx?: SxProps;
  usdValue: number;
}

export const CryptoWallet: FC<CryptoWalletProps> = (props) => {
  const { coinAmount, chartColor, chartSeries, currency, rate, usdValue, sx } = props;
  const chartOptions = useChartOptions(chartColor);
  const formattedUsdValue = numeral(usdValue).format('$0,0.00');
  const logo = logoMap[currency];
  const rateColor = rate < 0 ? 'error.main' : 'success.main';
  const rateIcon = rate < 0 ? <ChevronDownIcon /> : <ChevronUpIcon />;

  return (
    <Card sx={sx}>
      <CardHeader
        action={
          <IconButton>
            <SvgIcon>
              <DotsHorizontalIcon />
            </SvgIcon>
          </IconButton>
        }
        subheader={formattedUsdValue}
        sx={{ pb: 0 }}
        title={
          <Typography
            color="text.secondary"
            sx={{ mb: 1 }}
            variant="h6"
          >
            <Typography
              color="text.primary"
              component="span"
              variant="inherit"
            >
              {coinAmount}
            </Typography>{' '}
            {currency}
          </Typography>
        }
      />
      <Chart
        height={140}
        options={chartOptions}
        series={chartSeries}
        type="area"
      />
      <Box
        sx={{
          pb: 2,
          px: 2,
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <Box
            component="img"
            src={logo}
            sx={{ flex: '0 0 auto' }}
          />
          <div>
            <Typography variant="subtitle2">{currency}/USD</Typography>
            <Stack
              alignItems="center"
              direction="row"
              sx={{ color: rateColor }}
              spacing={0.5}
            >
              <SvgIcon
                color="inherit"
                fontSize="small"
              >
                {rateIcon}
              </SvgIcon>
              <Typography
                color="inherit"
                variant="body2"
              >
                {rate}%
              </Typography>
            </Stack>
          </div>
        </Stack>
      </Box>
    </Card>
  );
};

CryptoWallet.propTypes = {
  chartColor: PropTypes.string.isRequired,
  chartSeries: PropTypes.array.isRequired,
  coinAmount: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  rate: PropTypes.number.isRequired,
  // @ts-ignore
  sx: PropTypes.object,
  usdValue: PropTypes.number.isRequired,
};
