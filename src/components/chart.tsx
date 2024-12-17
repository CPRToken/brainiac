import dynamic from 'next/dynamic';
import type { Props } from 'react-apexcharts';
import { alpha } from '@mui/system/colorManipulator';
import { styled } from '@mui/material/styles';

const ApexChart = dynamic<Props>(() => import('react-apexcharts'), {
  ssr: false,

  loading: () => null,
});

export const Chart = styled(ApexChart)(({ theme }) => ({
  '& .apexcharts-xaxistooltip': {
    background: 'transparent',
    boxShadow: 'none',
    borderRadius: theme.shape.borderRadius,

  },
  '& .apexcharts-tooltip': {
    '&.apexcharts-theme-light, &.apexcharts-theme-dark': {

      background: 'transparent',
      border: 0,
      boxShadow: 'none',
      '& .apexcharts-tooltip-title': {
        background: alpha(theme.palette.neutral![900], 0.8),
        border: 0,
        color: theme.palette.common.white,
        margin: 0,
      },
      '& .apexcharts-tooltip-series-group': {
        background: alpha(theme.palette.neutral![500], 0.1),
        border: 0,
        color: theme.palette.common.white,
      },
    },
  },
}));
