//src/theme/typography.ts
import { Inter, Open_Sans, Oswald, Montserrat  } from 'next/font/google';

// ----------------------------------------------------------------------

export function remToPx(value: string) {
  return Math.round(parseFloat(value) * 16);
}

export function pxToRem(value: number) {
  return `${value / 16}rem`;
}

export function responsiveFontSizes({ xs, sm, md, lg }: { xs?: number; sm: number; md: number; lg: number }) {
  return {
    '@media (max-width:600px)': {
      fontSize: xs ? pxToRem(xs) : undefined,
    },
    '@media (min-width:600px)': {
      fontSize: pxToRem(sm),
    },
    '@media (min-width:900px)': {
      fontSize: pxToRem(md),
    },
    '@media (min-width:1200px)': {
      fontSize: pxToRem(lg),
    },
  };
}



export const primaryFont = Inter({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

export const secondaryFont = Open_Sans({
  weight: ['400'], // Only include the available weight
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});


export const tertiaryFont = Open_Sans({
  weight: ['300', '400','500','700'], // Example weights, you can choose what you need
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

export const quaternaryFont = Oswald({
  weight: ['400','500', '700'], // Example weights, adjust as needed
  subsets: ['latin'],
  display: 'swap',
  fallback: ['serif'], // Fallback to a generic serif font
});

export const quinaryFont = Montserrat({
  weight: ['100','200', '300','400','500', '700'], // Example weights, adjust as needed
  subsets: ['latin'],
  display: 'swap',
  fallback: ['serif'], // Fallback to a generic serif font
});

// ----------------------------------------------------------------------

// LEARN MORE
// https://nextjs.org/docs/basic-features/font-optimization#google-fonts

export const typography = {
  fontFamily: primaryFont.style.fontFamily,
  fontSecondaryFamily: secondaryFont.style.fontFamily,
  fontTertiaryFamily: tertiaryFont.style.fontFamily,
  fontQuaternaryFamily: quaternaryFont.style.fontFamily,
  fontQuinaryFamily: quinaryFont.style.fontFamily,
  fontWeightThin: 100,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
  h1: {
    fontWeight: 600,
    lineHeight: 90 / 64,
    fontSize: pxToRem(40),
    fontFamily: primaryFont.style.fontFamily,
    ...responsiveFontSizes({ sm: 40, md: 50, lg: 50 }),
  },
  h2: {
    fontWeight: 500,
    lineHeight: 75 / 50,
    fontSize: pxToRem(32),
    fontFamily: quinaryFont.style.fontFamily,
    ...responsiveFontSizes({ sm: 35, md: 37, lg: 40 }),
  },
  h3: {
    fontWeight: 500,
    lineHeight: 64 / 48,
    fontSize: pxToRem(34),
    fontFamily: primaryFont.style.fontFamily,
    ...responsiveFontSizes({ sm: 25, md: 33, lg: 34 }),
  },
  h4: {
    fontWeight: 500,
    lineHeight: 1.4,
    fontSize: pxToRem(26),
    fontFamily: tertiaryFont.style.fontFamily,
    ...responsiveFontSizes({ xs:19, sm: 21, md: 24, lg: 26 }),
  },
  h5: {
    fontWeight: 500,
    lineHeight: 1.5,
    fontSize: pxToRem(22),
    fontFamily: primaryFont.style.fontFamily,
    textTransform: 'uppercase',
    ...responsiveFontSizes({ sm: 22, md: 25, lg: 23 }),
  },
  h6: {
    fontWeight: 500,
    lineHeight:  1.4,
    fontSize: pxToRem(22),
    fontFamily:primaryFont.style.fontFamily,
    ...responsiveFontSizes({ sm: 15, md: 17, lg: 22 }),
  },
  subtitle1: {
    fontWeight: 600,
    lineHeight: 1.2,
    fontSize: pxToRem(13),
    fontFamily: primaryFont.style.fontFamily,
    textTransform: 'uppercase',
    ...responsiveFontSizes({ sm: 14, md: 13, lg: 13 }), // Add responsive sizes
  },
  subtitle2: {
    fontWeight: 400,
    lineHeight: 1.5,
    fontSize: pxToRem(13),
    ...responsiveFontSizes({ sm: 13, md: 13, lg: 13 }), // Add responsive sizes
  },
  body1: {
    fontWeight: 200,
    lineHeight: 1.6,
    fontSize: pxToRem(17),
    fontFamily: primaryFont.style.fontFamily,
    ...responsiveFontSizes({ xs:15, sm: 16, md: 16, lg: 17 }), // Add responsive sizes
  },
  body2: {
    lineHeight: 1.0,
    fontSize: pxToRem(17),
    fontFamily: primaryFont.style.fontFamily,
    ...responsiveFontSizes({ xs:15, sm: 16, md: 16, lg: 17 }), // Add responsive sizes
  },


  caption: {
    lineHeight: 1.5,
    fontSize: pxToRem(12),
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    textTransform: 'uppercase',
  },
  button: {
    fontWeight: 700,
    lineHeight: 24 / 14,
    fontSize: pxToRem(14),
    textTransform: 'capitalize',
  },
} as const;
