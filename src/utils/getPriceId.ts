// utils/getPriceId.ts
export const getPriceId = (plan: string): string => {
  if (plan === 'Basic') return 'price_1Pk4zmI7exj9oAo9khc4OT16';
  if (plan === 'Premium') return 'price_1Pk4zkI7exj9oAo9N92hGKqe';
  if (plan === 'Business') return 'price_1Pk4ziI7exj9oAo95ZIL3sby';
  if (plan === 'BasicYearly') return 'price_1Pk4zgI7exj9oAo9DSyIUy8G';
  if (plan === 'PremiumYearly') return 'price_1Pk4zeI7exj9oAo9eUPovxQl';
  if (plan === 'BusinessYearly') return 'price_1Pk4zbI7exj9oAo9qsyipPNj';

  throw new Error(`Unknown plan: ${plan}`);
};
