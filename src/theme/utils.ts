import type { PaletteColor } from '@mui/material/styles/createPalette';

import type { ColorPreset } from '.';
import { blue, green, indigo, purple, pink } from './colors';

export const getPrimary = (preset?: ColorPreset): PaletteColor => {
  switch (preset) {
    case 'blue':
      return blue;
    case 'green':
      return green;
    case 'indigo':
      return indigo;
    case 'pink':
      return pink;
    case 'purple':
      return purple;
    default:
      console.error(
        'Invalid color preset, accepted values: "blue", "green", "pink" , "indigo" or "purple"".'
      );
      return blue;
  }
};
