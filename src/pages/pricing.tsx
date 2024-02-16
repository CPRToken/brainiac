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

export const PricingSection: FC = () => {
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

  const handleCheckout = async () => {
    if (!stripe) {
      console.error('Stripe not initialized');
      return;
    }

    const stripePriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
    const successUrl = process.env.NEXT_PUBLIC_SUCCESS_URL;
    const cancelUrl = process.env.NEXT_PUBLIC_CANCEL_URL;

    if (!stripePriceId || !successUrl || !cancelUrl) {
      console.error('Required environment variables are undefined');
      return;
    }

    const { error } = await stripe.redirectToCheckout({
      lineItems: [{
        price: stripePriceId, // Ensured to be a string
        quantity: 1,
      }],
      mode: 'subscription',
      successUrl: successUrl,
      cancelUrl: cancelUrl,
    });

    if (error) {
      console.error('Checkout error:', error);
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
              <Grid
                xs={12}
                md={4}
              >
                <PricingPlan
                  cta="Start Free Trial"
                  currency="$"
                  description={t(tokens.form.planDescription)}
                  features={['Create contracts', 'Chat support', 'Email alerts']}
                  icon={<PricingPlanIcon name="startup" />}
                  name="Startup"
                  price="9.95"
                  sx={{
                    height: '100%',
                    maxWidth: 460,
                    mx: 'auto',
                  }}
                />
              </Grid>
              <Grid
                xs={12}
                md={4}
              >
                <div
                  onClick={handleCheckout}
                  style={{
                    cursor: 'pointer',
                    height: '100%', // Ensuring the div takes full height
                    maxWidth: 460,
                    marginLeft: 'auto', // Replacing mx with marginLeft and marginRight
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
                      // Add other features as needed
                    ]}
                    icon={<PricingPlanIcon name="standard" />}
                    name="Standard"
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

              <Grid
                xs={12}
                md={4}
              >
                <PricingPlan
                  cta="Contact Us"
                  currency="$"
                  description={t(tokens.form.planDescription)}
                  features={[
                    t(tokens.form.AllPrevious),
                    t(tokens.form.Alternative),
                    t(tokens.form.UnlimitedData),
                    t(tokens.form.Salsa),
                    // Add other features as needed
                  ]}
                  icon={<PricingPlanIcon name="business" />}
                  name="Business"
                  price="29.99"
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
