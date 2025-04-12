// utils/getPriceId.ts
import { tokens } from "../locales/tokens";

export const getPriceId = (plan: string, t?: (key: string) => string): string => {
  if (plan === 'Basic') return t ? t(tokens.form.priceBasic) : 'price_1QNpMjI7exj9oAo9ColPjP1G';
  if (plan === 'Premium') return t ? t(tokens.form.pricePremium) : 'price_1QNpZYI7exj9oAo9f2IXAwdx';
  if (plan === 'Business') return t ? t(tokens.form.priceBusiness) : 'price_1QNpgKI7exj9oAo9DMTVCQBz';
  if (plan === 'BasicYearly') return t ? t(tokens.form.priceBasicYearly) : 'price_1QNpQPI7exj9oAo9rx2W7jkg';
  if (plan === 'PremiumYearly') return t ? t(tokens.form.pricePremiumYearly) : 'price_1QNpeNI7exj9oAo9mCyQ1FJa';
  if (plan === 'BusinessYearly') return t ? t(tokens.form.priceBusinessYearly) : 'price_1QNpiKI7exj9oAo9CcI657sF';
  if (plan === 'Canceled') return 'price_canceled';
  if (plan === 'CancelPending') return 'price_cancel_pending';

  throw new Error(`Unknown plan: ${plan}`);
};
