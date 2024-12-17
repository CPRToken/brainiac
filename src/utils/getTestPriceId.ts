// utils/getTestPriceId.ts
export const getTestPriceId = (plan: string): string => {
  if (plan === 'Basic') return 'price_1PgQI4I7exj9oAo949UmThhH';
  if (plan === 'Premium') return 'price_1PgQJsI7exj9oAo9mUdbE0ZX';
  if (plan === 'Business') return 'price_1PgQKSI7exj9oAo9acr903Ka';
  if (plan === 'BasicYearly') return 'price_1PjDoqI7exj9oAo95jqY8uSw';
  if (plan === 'PremiumYearly') return 'price_1PjDpjI7exj9oAo9UkvkaR6x';
  if (plan === 'BusinessYearly') return 'price_1PjDr8I7exj9oAo9lm4zAEDn';

  throw new Error(`Unknown plan: ${plan}`);
};
