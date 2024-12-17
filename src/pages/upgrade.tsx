// pages/upgrade.tsx
import React, { FC, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import { useTranslation } from "react-i18next";
import {LanguageSwitch }from 'src/layouts/dashboard/language-switch/language-switch';
import Typography from '@mui/material/Typography';
import { typography } from "src/theme/typography";
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { PricingFaqs } from 'src/sections/pricing/pricing-faqs';
import { PricingPlan } from 'src/sections/pricing/pricing-plan';
import { PricingPlanIcon } from 'src/sections/pricing/pricing-plan-icon';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { tokens } from "../locales/tokens";
import type { Profile } from 'src/types/social';
import { getAuth } from 'firebase/auth';
import { socialApi } from 'src/api/social/socialApi';
import { getPriceId } from 'src/utils/getPriceId';



const PricingSection: FC = () => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const { t } = useTranslation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isYearly, setIsYearly] = useState(false);


  usePageView();

  useEffect(() => {
    const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!stripePublishableKey) {
      console.error("Stripe publishable key is not set in environment variables");
      return;
    }

    loadStripe(stripePublishableKey)
      .then(stripeInstance => {
        if (stripeInstance) {
          setStripe(stripeInstance);
        }
      })
      .catch(error => console.error("Stripe initialization error:", error));

    const fetchProfile = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const userProfile = await socialApi.getProfile({ uid: user.uid });
          setProfile(userProfile);
        } else {
          console.error('User not authenticated');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);


  const handleCheckout = async (selectedPlan: string) => {
    const priceId = getPriceId(selectedPlan, t); // Calculate `priceId` dynamically on the client

    const requestBody = {
      userId: profile?.uid,
      userEmail: profile?.email,
      planName: selectedPlan,
      stripeCustomerId: profile?.stripeCustomerId || '',
      priceId, // Send `priceId` to the API
    };

    const response = await fetch('/api/checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create Stripe checkout session: ${errorText}`);
    }

    const session = await response.json();
    await stripe?.redirectToCheckout({ sessionId: session.sessionId });
  };



  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsYearly(event.target.checked);
  };

  return (
    <>
      <LanguageSwitch />
      <Seo title="Pricing" />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50',
            pb: '50px',
            pt: '50px',
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                mb: 4,
              }}
            >
              <Typography sx={{ ...typography.h3, color: 'text.primary', mt: 2, mb: 0 }}>
                {t(tokens.headings.startToday)}
              </Typography>
              <Typography sx={{ ...typography.body2, color: 'text.primary', mt: 2, mb: 1 }}>
                {t(tokens.headings.joinTwoThousand)}
              </Typography>
              <Typography sx={{ ...typography.body2, color: 'text.primary', mt: 2, mb: 3 }}>
                {t(tokens.form.planDescription)}
              </Typography>
              <Stack alignItems="center" direction="row" spacing={1}>
                <Switch checked={isYearly} onChange={handleSwitchChange} />
                <Typography sx={{ ...typography.h6, color: 'text.primary', mt: 9, mb: 0 }}>
                  {isYearly ? t(tokens.form.yearlyPayment) : t(tokens.form.monthlyPayment)}
                </Typography>
              </Stack>
            </Box>
            <Grid container spacing={4}>
              <Grid xs={12} md={4}>
                <div
                  onClick={() => handleCheckout(isYearly ? 'BasicYearly' : 'Basic')}
                  style={{
                    cursor: 'pointer',
                    height: '100%',
                    maxWidth: 460,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  <PricingPlan
                    cta={t(tokens.form.upgrade)}
                    currency="$"
                    description={t(tokens.form.planDescription)}
                    info={t(tokens.form.allContent)}
                    features={[
                      t(tokens.nav.imageGenerator),
                      t(tokens.form.basicTools),
                      t(tokens.nav.SEOWriter),
                      t(tokens.form.unlimitedWords),

                    ]}
                    icon={<PricingPlanIcon name="startup" />}
                    name={t(tokens.form.Basic)}
                    popular
                    price={isYearly ? t(tokens.form.priceBasicYearlyCurrency) : t(tokens.form.priceBasicCurrency)} //
                    priceId={isYearly ? t(tokens.form.priceBasicYearly) : t(tokens.form.priceBasic)} // Use tokens for dynamic IDs
                    sx={{
                      height: '100%',
                      maxWidth: 460,
                      mx: 'auto',
                    }}
                  />
                </div>
              </Grid>
              <Grid xs={12} md={4}>
                <div
                  onClick={() => handleCheckout(isYearly ? 'PremiumYearly' : 'Premium')}
                  style={{
                    cursor: 'pointer',
                    height: '100%',
                    maxWidth: 460,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  <PricingPlan
                    cta={t(tokens.form.upgrade)}
                    currency="$"
                    description={t(tokens.form.planDescription)}
                    info={t(tokens.form.allContent)}
                    features={[
                      t(tokens.nav.imageGenerator),
                      t(tokens.form.premTools),
                      t(tokens.nav.SEOWriter),
                      t(tokens.form.unlimitedWords),


                    ]}
                    icon={<PricingPlanIcon name="standard" />}
                    name={t(tokens.form.Premium)}
                    popular
                    price={isYearly ? t(tokens.form.pricePremiumYearlyCurrency) : t(tokens.form.pricePremiumCurrency)}
                    priceId={isYearly ? t(tokens.form.pricePremiumYearly) : t(tokens.form.pricePremium)}
                    sx={{
                      height: '100%',
                      maxWidth: 460,
                      mx: 'auto',
                    }}
                  />
                </div>
              </Grid>
              <Grid xs={12} md={4}>
                <div
                  onClick={() => handleCheckout(isYearly ? 'BusinessYearly' : 'Business')}
                  style={{
                    cursor: 'pointer',
                    height: '100%',
                    maxWidth: 460,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  <PricingPlan
                    cta={t(tokens.form.upgrade)}
                    currency="$"
                    description={t(tokens.form.planDescription)}
                    info={t(tokens.form.allContent)}
                    features={[
                      t(tokens.nav.imageGenerator),
                      t(tokens.form.businessTools),
                      t(tokens.nav.SEOWriter),
                      t(tokens.form.unlimitedWords),



                    ]}
                    icon={<PricingPlanIcon name="business" />}
                    name={t(tokens.form.BusinessP)}
                    popular
                    price={isYearly ? t(tokens.form.priceBusinessYearlyCurrency) : t(tokens.form.priceBusinessCurrency)}
                    priceId={isYearly ? t(tokens.form.priceBusinessYearly) : t(tokens.form.priceBusiness)}
                    sx={{
                      height: '100%',
                      maxWidth: 460,
                      mx: 'auto',
                    }}
                  />
                </div>
              </Grid>
            </Grid>
            <Box sx={{ mt: 4 }}>
              <Typography
                align="center"
                color="text.secondary"
                component="p"
                variant="caption"
              >
                {/* Any additional text */}
              </Typography>
            </Box>
          </Container>
        </Box>

        <PricingFaqs />
      </Box>
    </>
  );
};

export default PricingSection;
