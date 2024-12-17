//src/components/settings/settings-drawer/options-nav-color.tsx
import type { FC } from 'react';
import PropTypes from 'prop-types';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { tokens } from 'src/locales/tokens';
import Typography from '@mui/material/Typography';
 import type { NavColor } from 'src/types/settings';
import {useTranslation} from "react-i18next";

interface Option {
  label: string;
  value: NavColor;
}


interface OptionsNavColorProps {
  onChange?: (value: NavColor) => void;
  value?: NavColor;
}

export const OptionsNavColor: FC<OptionsNavColorProps> = (props) => {
  const { onChange, value } = props;
  const { t } = useTranslation();


  const options: Option[] = [
    {
      label: t(tokens.form.blendIn),
      value: 'blend-in',
    },
    {
      label: t(tokens.form.discreet),
      value: 'discrete',
    },
    {
      label: t(tokens.form.evident),
      value: 'evident',
    },
  ];


  return (
    <Stack spacing={1}>
      <Typography color="text.secondary" variant="overline">
        {t(tokens.headings.navColor)}
      </Typography>
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        gap={2}
      >
        {options.map((option) => (
          <Chip
            key={option.label}
            label={option.label}
            onClick={() => onChange?.(option.value)}
            sx={{
              borderColor: 'transparent',
              borderRadius: 1.5,
              borderStyle: 'solid',
              borderWidth: 2,
              ...(option.value === value && {
                borderColor: 'primary.main',
              }),
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
};

OptionsNavColor.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.oneOf(['blend-in', 'discrete', 'evident']),
};
