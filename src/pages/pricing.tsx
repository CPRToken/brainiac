// pages/pricing.tsx
import React, { FC, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useTranslation } from "react-i18next";
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





const PricingArea: FC = () => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const { t } = useTranslation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  usePageView();

  useEffect(() => {
    const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY;

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

  type PlanName = 'Basic' | 'Premium' | 'Business' | 'BasicYearly' | 'PremiumYearly' | 'BusinessYearly';

  const priceIdMapping = {
    Basic: 'price_1PgQI4I7exj9oAo949UmThhH',
    Premium: 'price_1PgQJsI7exj9oAo9mUdbE0ZX',
    Business: 'price_1PgQKSI7exj9oAo9acr903Ka',
    BasicYearly: 'price_1PjDoqI7exj9oAo95jqY8uSw',
    PremiumYearly: 'price_1PjDpjI7exj9oAo9UkvkaR6x',
    BusinessYearly: 'price_1PjDr8I7exj9oAo9lm4zAEDn',
  };

  const handleCheckout = async (selectedPlan: PlanName) => {
    const priceId = priceIdMapping[selectedPlan];
    if (!priceId) {
      console.error('No price ID found for the selected plan:', selectedPlan);
      return;
    }

    if (!stripe) {
      console.error('Stripe not initialized');
      return;
    }

    if (!profile || !profile.uid || !profile.email) {
      console.error('User profile is not loaded or essential details are missing');
      return;
    }

    try {
      const requestBody = {
        userId: profile.uid,
        userEmail: profile.email,
        planName: selectedPlan,
        stripeCustomerId: profile.stripeCustomerId || '',
        priceId: priceId,
      };

      const response = await fetch('/api/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create Stripe checkout session: ${errorText}`);
      }

      const session = await response.json();
      const { error } = await stripe.redirectToCheckout({ sessionId: session.sessionId });
      if (error) {
        console.error('Stripe checkout error:', error);
        return;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <>
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
              <Typography sx={{ ...typography.h3, color: 'text.primary', mt: 9, mb: 0 }}>
                {t(tokens.headings.startToday)}
              </Typography>
              <Typography sx={{ ...typography.body2, color: 'text.primary', mt: 2, mb: 1 }}>
                {t(tokens.headings.joinTwoThousand)}
              </Typography>
              <Tabs value={tabIndex} onChange={handleTabChange}>
                <Tab label={t(tokens.form.monthlyPayment)} />
                <Tab label={t(tokens.form.yearlyPayment)} />
              </Tabs>
            </Box>
            <Grid container spacing={4}>
              {tabIndex === 0 && (
                <>
                  <Grid xs={12} md={4}>
                    <div
                      onClick={() => handleCheckout('Basic')}
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
                        features={[
                          t(tokens.form.AllPrevious),
                          t(tokens.form.Alternative),
                          t(tokens.form.UnlimitedData),
                          t(tokens.form.Salsa),
                        ]}
                        icon={<PricingPlanIcon name="startup" />}
                        name={t(tokens.form.Basic)}
                        popular
                        price="9.95"
                        priceId='price_1PgQI4I7exj9oAo949UmThhH'
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
                      onClick={() => handleCheckout('Premium')}
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
                        features={[
                          t(tokens.form.AllPrevious),
                          t(tokens.form.Alternative),
                          t(tokens.form.UnlimitedData),
                          t(tokens.form.Salsa),
                        ]}
                        icon={<PricingPlanIcon name="standard" />}
                        name={t(tokens.form.Premium)}
                        popular
                        price="14.95"
                        priceId='price_1PgQJsI7exj9oAo9mUdbE0ZX'
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
                      onClick={() => handleCheckout('Business')}
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
                        features={[
                          t(tokens.form.AllPrevious),
                          t(tokens.form.Alternative),
                          t(tokens.form.UnlimitedData),
                          t(tokens.form.Salsa),
                        ]}
                        icon={<PricingPlanIcon name="business" />}
                        name={t(tokens.form.BusinessP)}
                        popular
                        price="19.95"
                        priceId='price_1PgQKSI7exj9oAo9acr903Ka'
                        sx={{
                          height: '100%',
                          maxWidth: 460,
                          mx: 'auto',
                        }}
                      />
                    </div>
                  </Grid>
                </>
              )}
              {tabIndex === 1 && (
                <>
                  <Grid xs={12} md={4}>
                    <div
                      onClick={() => handleCheckout('BasicYearly')}
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
                        features={[
                          t(tokens.form.AllPrevious),
                          t(tokens.form.Alternative),
                          t(tokens.form.UnlimitedData),
                          t(tokens.form.Salsa),
                        ]}
                        icon={<PricingPlanIcon name="startup" />}
                        name={t(tokens.form.Basic)}
                        popular
                        price="7.95"
                        priceId='price_1PjDoqI7exj9oAo95jqY8uSw '
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
                      onClick={() => handleCheckout('PremiumYearly')}
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
                        features={[
                          t(tokens.form.AllPrevious),
                          t(tokens.form.Alternative),
                          t(tokens.form.UnlimitedData),
                          t(tokens.form.Salsa),
                        ]}
                        icon={<PricingPlanIcon name="standard" />}
                        name={t(tokens.form.Premium)}
                        popular
                        price="12.95"
                        priceId='price_1PjDpjI7exj9oAo9UkvkaR6x'
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
                      onClick={() => handleCheckout('BusinessYearly')}
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
                        features={[
                          t(tokens.form.AllPrevious),
                          t(tokens.form.Alternative),
                          t(tokens.form.UnlimitedData),
                          t(tokens.form.Salsa),
                        ]}
                        icon={<PricingPlanIcon name="business" />}
                        name={t(tokens.form.BusinessP)}
                        popular
                        price="14.95"
                        priceId='price_1PjDr8I7exj9oAo9lm4zAEDn'
                        sx={{
                          height: '100%',
                          maxWidth: 460,
                          mx: 'auto',
                        }}
                      />
                    </div>
                  </Grid>
                </>
              )}
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
}
export default PricingArea;
