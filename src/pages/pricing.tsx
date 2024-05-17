import React, { FC, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import {useTranslation} from "react-i18next";
import Typography from '@mui/material/Typography';
import {typography } from "src/theme/typography";
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { PricingFaqs } from 'src/sections/pricing/pricing-faqs';
import { PricingPlan } from 'src/sections/pricing/pricing-plan';
import { PricingPlanIcon } from 'src/sections/pricing/pricing-plan-icon';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import {tokens} from "../locales/tokens";
import { auth } from 'src/libs/firebase';

interface SubscriptionDetails {
  email: string;
  planId: string;
}



const PricingSection: FC = () => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const { t } = useTranslation();


  usePageView();

  useEffect(() => {
    // Temporarily using the Stripe test key for debugging
    const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY;

    if (!stripePublishableKey) {
      console.error("Stripe test publishable key is not set in environment variables");
      return; // Exit the function if the key is not available
    }

    // Initialize Stripe with the test key
    loadStripe(stripePublishableKey)
      .then(stripeInstance => {
        if (stripeInstance) {
          setStripe(stripeInstance);
        }
      })
      .catch(error => console.error("Stripe initialization error:", error));
  }, []);

  const createSubscription = async ({email, planId}: SubscriptionDetails): Promise<any> => {
    const response = await fetch('/api/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, planId }),
    });
    const data = await response.json();
    if (!response.ok) {
      console.error('Error creating subscription:', data.error);
      throw new Error(data.error);
    }
    return data;
  };

  const handleCheckout = async (selectedPlan: 'Basic' | 'Premium' | 'Business'): Promise<void> => {
    console.log(`Plan selected: ${selectedPlan}`);

    if (!stripe) {
      console.error('Stripe not initialized');
      return;
    }

    const user = auth.currentUser;
    if (!user || !user.email) {
      console.error('User is not logged in or email is not available');
      return;
    }

    const userEmail = user.email;

    const planIds: { [key in 'Basic' | 'Premium' | 'Business']: string | undefined } = {
      'Basic': 'price_1PAEfLFM88NqciSf9szD0Elw',
      'Premium': 'price_1PAEhPFM88NqciSfgf7FlAuo',
      'Business': 'price_1PADeNFM88NqciSfIZ1FbwrX'
    };

    const stripePriceId = planIds[selectedPlan];

    if (!stripePriceId) {
      console.error('Plan ID is undefined');
      return;
    }

    const successUrl = process.env.NEXT_PUBLIC_SUCCESS_URL;
    const cancelUrl = process.env.NEXT_PUBLIC_CANCEL_URL;

    if (!successUrl || !cancelUrl) {
      console.error('Required URLs are undefined');
      return;
    }

    try {
      await createSubscription({ email: userEmail, planId: stripePriceId });

      await stripe.redirectToCheckout({
        lineItems: [{ price: stripePriceId, quantity: 1 }],
        mode: 'subscription',
        successUrl,
        cancelUrl,
      });
    } catch (error) {
      console.error('Checkout or subscription error:', error);
    }
  };



  return (
    <>
      <Seo title="Pricing" />
      <Box
        component="main"
        sx={{ flexGrow: 1 }}
      >
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
                <Chip
                  color="primary"
                  label="25% OFF"
                  size="small"
                />
              </Stack>
            </Box>
            <Grid
              container
              spacing={4}
            >

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
                    cta="Start Free Trial"
                    currency="$"
                    description={t(tokens.form.planDescription)}
                    features={['Create contracts', 'Chat support', 'Email alerts']}
                    icon={<PricingPlanIcon name="startup"/>}
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
                    cta="Start Free Trial"
                    currency="$"
                    description={t(tokens.form.planDescription)}
                    features={[
                      t(tokens.form.AllPrevious),
                      t(tokens.form.Alternative),
                      t(tokens.form.UnlimitedData),
                      t(tokens.form.Salsa),
                    ]}
                    icon={<PricingPlanIcon name="standard"/>}
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
                <PricingPlan
                  cta="Contact Us"
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
                  price="29.95"
                  sx={{
                    height: '100%',
                    maxWidth: 460,
                    mx: 'auto',
                  }}
                />
              </Grid>

            </Grid>
            <Box sx={{ mt: 4 }}>
              <Typography
                align="center"
                color="text.secondary"
                component="p"
                variant="caption"
              >

              </Typography>
            </Box>
          </Container>
        </Box>
        <Divider />
        <PricingFaqs />
      </Box>
    </>
  );
};
export default PricingSection;
