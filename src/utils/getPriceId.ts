// utils/getPriceId.ts
export const getPriceId = (plan: string): string => {
  if (plan === 'Basic') return process.env.LIVE_PRICE_BASIC!;
  if (plan === 'Premium') return process.env.LIVE_PRICE_PREMIUM!;
  if (plan === 'Business') return process.env.LIVE_PRICE_BUSINESS!;
  if (plan === 'BasicYearly') return process.env.LIVE_PRICE_BASIC_YEARLY!;
  if (plan === 'PremiumYearly') return process.env.LIVE_PRICE_PREMIUM_YEARLY!;
  if (plan === 'BusinessYearly') return process.env.LIVE_PRICE_BUSINESS_YEARLY!;

  throw new Error(`Unknown plan: ${plan}`);
};
