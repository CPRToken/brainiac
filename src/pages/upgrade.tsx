//pages/upgrade.tsx
import React, { FC, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
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
import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'src/libs/firebase';


const planToPriceId = {
  Basic: 'price_1PgQI4I7exj9oAo949UmThhH',
  Premium: 'price_1PgQJsI7exj9oAo9mUdbE0ZX',
  Business: 'price_1PgQKSI7exj9oAo9acr903Ka'
};

const PricingSection: FC = () => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const { t } = useTranslation();
  const [profile, setProfile] = useState<Profile | null>(null);

  usePageView();

  useEffect(() => {
    const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY;

    if (!stripePublishableKey) {
      console.error("Stripe test publishable key is not set in environment variables");
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

  const updateUserPlan = async (uid: string, plan: string, stripeCustomerId?: string) => {
    const userDocRef = doc(db, 'users', uid);
    const updateData: any = { plan };
    if (stripeCustomerId) {
      updateData.stripeCustomerId = stripeCustomerId;
    }

    try {
      await updateDoc(userDocRef, updateData);
      console.log(`Successfully updated user ${uid} plan to ${plan}`);
    } catch (error) {
      console.error('Failed to update user plan:', error);
      throw new Error('Failed to update user plan');
    }
  };

  type PlanName = 'Basic' | 'Premium' | 'Business';

  const handleCheckout = async (selectedPlan: PlanName) => {
    console.log(`Plan selected: ${selectedPlan}`);

    if (!stripe) {
      console.error('Stripe not initialized');
      return;
    }

    if (!profile || !profile.uid || !profile.email) {
      console.error('User profile is not loaded or essential details are missing');
      return;
    }

    // Corrected: Fetch the price ID using the plan name from the mapping
    const priceId = planToPriceId[selectedPlan];
    if (!priceId) {
      console.error('No price ID found for the selected plan:', selectedPlan);
      console.log('Price ID:', priceId);
      return;
    }

    try {
      const requestBody = {
        userId: profile.uid,
        userEmail: profile.email,
        planName: selectedPlan, // Corrected: Use the plan name as expected by the API
        stripeCustomerId: profile.stripeCustomerId || '',
      };

      console.log('Sending request with:', requestBody);

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
      console.log('Stripe checkout session created:', session.sessionId);
      const { error } = await stripe.redirectToCheckout({ sessionId: session.sessionId });
      if (error) {
        console.error('Stripe checkout error:', error);
        return;
      }

      // Optionally update Firestore after successful payment
      await updateUserPlan(profile.uid, selectedPlan.toLowerCase(), profile.stripeCustomerId || '');
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
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
              <Typography
                color="text.secondary"
                sx={{ my: 2 }}
                variant="body1"
              >
                Join 6,000+ users and growing
              </Typography>
              <Stack
                alignItems="center"
                direction="row"
                spacing={1}
              >
                <Switch checked />
                <Typography sx={{ ...typography.h6, color: 'text.primary', mt: 9, mb: 0 }}>
                  {t(tokens.form.yearlyPayment)}
                </Typography>
              </Stack>
            </Box>
            <Grid container spacing={4}>
              <Grid xs={12} md={4}>
                <div
                  onClick={() => handleCheckout('Basic')}
                  style={{
                    cursor: 'pointer',
                    height: '100%',
                    maxWidth: 460,
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  }}
                >
                  <PricingPlan
                    cta="Buy Now"
                    currency="$"
                    description={t(tokens.form.planDescription)}
                    features={['Create contracts', 'Chat support', 'Email alerts']}
                    icon={<PricingPlanIcon name="startup" />}
                    name="Basic"
                    price="9.95"
                    sx={{
                      height: '100%',
                      maxWidth: 460,
                      mx: 'auto'
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
                    marginRight: 'auto'
                  }}
                >
                  <PricingPlan
                    cta="Buy Now"
                    currency="$"
                    description={t(tokens.form.planDescription)}
                    features={[
                      t(tokens.form.AllPrevious),
                      t(tokens.form.Alternative),
                      t(tokens.form.UnlimitedData),
                      t(tokens.form.Salsa),
                    ]}
                    icon={<PricingPlanIcon name="standard" />}
                    name="Premium"
                    popular
                    price="14.95"
                    sx={{
                      height: '100%',
                      maxWidth: 460,
                      mx: 'auto'
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
                    marginRight: 'auto'
                  }}
                >
                  <PricingPlan
                    cta="Buy Now"
                    currency="$"
                    description={t(tokens.form.planDescription)}
                    features={[
                      t(tokens.form.AllPrevious),
                      t(tokens.form.Alternative),
                      t(tokens.form.UnlimitedData),
                      t(tokens.form.Salsa),
                    ]}
                    icon={<PricingPlanIcon name="business" />}
                    name="Business"
                    price="19.95"
                    sx={{
                      height: '100%',
                      maxWidth: 460,
                      mx: 'auto'
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
