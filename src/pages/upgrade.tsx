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
    const planName = selectedPlan
    const priceId = getPriceId(planName);

    if (!priceId) {
      console.error('No price ID found for the selected plan:', planName);
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
                    features={[
                      t(tokens.nav.imageGenerator),
                      t(tokens.nav.lyricWriter),
                      t(tokens.nav.SEOWriter),
                      t(tokens.nav.poemGenerator),
                      t(tokens.headings.dreamInterpretation),

                    ]}
                    icon={<PricingPlanIcon name="startup" />}
                    name={t(tokens.form.Basic)}
                    popular
                    price={isYearly ? "7.95" : "9.95"}
                    priceId={isYearly ? 'price_1PjDoqI7exj9oAo95jqY8uSw' : 'price_1PgQI4I7exj9oAo949UmThhH'}
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
                    features={[
                      t(tokens.nav.imageGenerator),
                      t(tokens.nav.lyricWriter),
                      t(tokens.nav.SEOWriter),
                      t(tokens.nav.scriptWriter),
                      t(tokens.nav.recipeWriter),
                      t(tokens.nav.poemGenerator),
                      t(tokens.nav.essayWriter),
                      t(tokens.nav.dietPlanner),
                      t(tokens.nav.storyGenerator),
                      t(tokens.headings.dreamInterpretation),
                      t(tokens.headings.magicMirror),
                      t(tokens.headings.philosophyWriter),
                      t(tokens.headings.interiorDesigner),
                      t(tokens.headings.uniAnswers),
                      t(tokens.headings.travelAgent),
                      t(tokens.headings.cocktailCrafter),
                      t(tokens.headings.dessertGenerator),
                      t(tokens.headings.bookSummariser),
                      t(tokens.headings.fruitsNVeges),
                      t(tokens.headings.biblicalFigures),
                      t(tokens.headings.idiomTranslator),

                    ]}
                    icon={<PricingPlanIcon name="standard" />}
                    name={t(tokens.form.Premium)}
                    popular
                    price={isYearly ? "12.95" : "14.95"}
                    priceId={isYearly ? 'price_1PjDpjI7exj9oAo9UkvkaR6x' : 'price_1PgQJsI7exj9oAo9mUdbE0ZX'}
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
                    features={[
                      t(tokens.nav.imageGenerator),
                      t(tokens.nav.lyricWriter),
                      t(tokens.nav.SEOWriter),
                      t(tokens.nav.scriptWriter),
                      t(tokens.nav.recipeWriter),
                      t(tokens.nav.poemGenerator),
                      t(tokens.nav.essayWriter),
                      t(tokens.nav.dietPlanner),
                      t(tokens.nav.storyGenerator),
                      t(tokens.headings.dreamInterpretation),
                      t(tokens.headings.magicMirror),
                      t(tokens.headings.philosophyWriter),
                      t(tokens.headings.interiorDesigner),
                      t(tokens.headings.uniAnswers),
                      t(tokens.headings.travelAgent),
                      t(tokens.headings.cocktailCrafter),
                      t(tokens.headings.dessertGenerator),
                      t(tokens.headings.bookSummariser),
                      t(tokens.headings.fruitsNVeges),
                      t(tokens.headings.biblicalFigures),
                      t(tokens.headings.idiomTranslator),
                      t(tokens.headings.editor),
                      t(tokens.headings.resumeBuilder),
                      t(tokens.headings.speechWriter),
                      t(tokens.headings.translator),
                      t(tokens.headings.careerDeveloper),
                      t(tokens.headings.startABusiness),
                      t(tokens.headings.investmentAdvisor),

                    ]}
                    icon={<PricingPlanIcon name="business" />}
                    name={t(tokens.form.BusinessP)}
                    popular
                    price={isYearly ? "14.95" : "19.95"}
                    priceId={isYearly ? 'price_1PjDr8I7exj9oAo9lm4zAEDn' : 'price_1PgQKSI7exj9oAo9acr903Ka'}
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
