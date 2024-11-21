//src/sections/pricing/pricing-plan.tsx
import type { FC, ReactNode } from 'react';
import propTypes from 'prop-types';
import CheckIcon from '@untitled-ui/icons-react/build/esm/Check';
import type { SxProps } from '@mui/system/styleFunctionSx';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import type { Theme } from '@mui/material/styles/createTheme';

interface PricingPlanProps {
  cta: string;
  currency?: string;
  description: string;
  info?: string;
  features: string[];
  icon: ReactNode;
  name: string;
  price: string;
  priceId: string; // Add this line
  popular?: boolean;
  sx?: SxProps<Theme>;
  onClick?: (priceId: string) => void;
}

export const PricingPlan: FC<PricingPlanProps> = (props) => {
  const { cta, currency, description, info, features, icon, name, price, priceId, popular, sx, onClick, ...other } = props;

  const handleClick = () => {
    if (onClick) {
      onClick(priceId);
    }
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            height: 52,
            width: 52,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Typography variant="h4">

            {price}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              alignSelf: 'flex-end',
              ml: 1,
            }}
            variant="subtitle2"
          >
            /mo
          </Typography>
        </Box>
        <Typography
          sx={{ mt: 2 }}
          variant="h5"
        >
          {name}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 2 }}
          variant="body1"
        >
          {info}
        </Typography>
      </Box>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          p: 3,
        }}
      >
        <Stack
          spacing={2}
          sx={{ flexGrow: 1 }}
        >
          {features.map((feature) => (
            <Stack
              alignItems="center"
              direction="row"
              spacing={1}
              key={feature}
              sx={{
                alignItems: 'center',
                display: 'flex',
              }}
            >
              <SvgIcon color="success">
                <CheckIcon />
              </SvgIcon>
              <Typography
                sx={{ fontWeight: 500 }}
                variant="body2"
              >
                {feature}
              </Typography>
            </Stack>
          ))}
        </Stack>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 6,
          }}
        >
          <Button
            fullWidth
            variant={popular ? 'contained' : 'outlined'}
            onClick={handleClick}
          >
            {cta}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

PricingPlan.propTypes = {
  cta: propTypes.string.isRequired,
  currency: propTypes.string.isRequired,
  description: propTypes.string.isRequired,
  info: propTypes.string,
  features: propTypes.array.isRequired,
  icon: propTypes.any.isRequired,
  name: propTypes.string.isRequired,
  price: propTypes.string.isRequired,
  priceId: propTypes.string.isRequired, // Add this line
  popular: propTypes.bool,
  sx: propTypes.object,
};
