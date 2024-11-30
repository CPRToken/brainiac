import type { FC } from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import { tokens } from 'src/locales/tokens';
import Typography from '@mui/material/Typography';
import { useTranslation } from "react-i18next";

interface OptionsNavColorProps {
  onChange?: (value: 'blend-in') => void;
  value?: 'blend-in';
}

export const OptionsNavColor: FC<OptionsNavColorProps> = (props) => {
  const { onChange } = props;
  const { t } = useTranslation();

  const defaultOption = {
    label: t(tokens.form.blendIn),
    value: 'blend-in' as const, // Explicitly set the type to the literal 'blend-in'
  };

  return (
    <Stack spacing={1}>
      <Typography color="text.secondary" variant="overline">
        {t(tokens.headings.navColor)}
      </Typography>
      <Stack alignItems="center" direction="row" flexWrap="wrap" gap={2}>
        <Typography
          onClick={() => onChange?.(defaultOption.value)}
          sx={{
            borderColor: 'transparent',
            borderRadius: 1.5,
            borderStyle: 'solid',
            borderWidth: 2,
            color: 'text.primary',
            cursor: 'pointer',
          }}
        >
          {defaultOption.label}
        </Typography>
      </Stack>
    </Stack>
  );
};

OptionsNavColor.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.oneOf(['blend-in']),
};
