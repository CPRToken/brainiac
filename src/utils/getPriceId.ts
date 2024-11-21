// utils/getPriceId.ts
import { tokens } from "../locales/tokens";

export const getPriceId = (plan: string, t: (key: string) => string): string => {
  if (plan === 'Basic') return t(tokens.form.priceBasic); // Use token for dynamic Price ID
  if (plan === 'Premium') return 'price_1Pk4zkI7exj9oAo9N92hGKqe';
  if (plan === 'Business') return 'price_1Pk4ziI7exj9oAo95ZIL3sby';
  if (plan === 'BasicYearly') return t(tokens.form.priceBasicYearly);
  if (plan === 'PremiumYearly') return 'price_1Pk4zeI7exj9oAo9eUPovxQl';
  if (plan === 'BusinessYearly') return 'price_1Pk4zbI7exj9oAo9qsyipPNj';

  throw new Error(`Unknown plan: ${plan}`);
};

