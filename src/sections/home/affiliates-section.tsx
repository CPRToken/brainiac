// pages/pricing.tsx
import React, { FC, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import SvgColor from "src/components/svg-color";
import { useTranslation } from "react-i18next";

import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { typography } from "src/theme/typography";
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { PricingFaqs } from 'src/sections/pricing/pricing-faqs';


const AffiliatesSection: FC = () => {


  const router = useRouter();


  usePageView();



  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {

  };

  return (
    <>

      <Seo title="Affiliates" />
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
              <Typography sx={{ ...typography.h4, color: 'text.primary', mt: 2, mb: 0 }}>
                Partner with Brainiac Media
              </Typography>

              <Typography sx={{ ...typography.body2, color: 'text.primary', mt: 2, mb: 1 }}>
                Earn 30% commission on every subscription
              </Typography>
              <Typography sx={{ ...typography.body2, color: 'text.primary', mt: 0, mb: 3 }}>
                Paid monthly, for the lifetime of the customer
              </Typography>
              <Stack alignItems="center" direction="row" spacing={1}>


              </Stack>
            </Box>

            <Grid container spacing={4}>
              {/* Column 1 */}
              <Grid xs={12} md={4}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SvgColor src="/assets/icons/career.svg" color="info" sx={{ width: '100%', height: '100%' }} />
                </Box>
                <Box sx={{ mt: 4, mb: 3 }}>
                  <Typography align="center" color="text.primary" component="p" variant="h5">
                    Sign Up Free
                  </Typography>
                </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography align="center" color="text.primary" component="p" variant="body2">
                      Create your affiliate account in minutes
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                    <Typography align="center" color="text.primary" component="p" variant="body2">
                      Get your unique referral link instantly.
                    </Typography>
                    </Box>

                </Box>
              </Grid>

              {/* Column 2 */}
              <Grid xs={12} md={4}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SvgColor src="/assets/icons/clock.svg" color="info" sx={{ width: '100%', height: '100%' }} />
                </Box>
                <Box sx={{ mt: 4, mb: 3 }}>
                  <Typography align="center" color="text.primary" component="p" variant="h5">
                    Share & Promote
                  </Typography>
                </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography align="center" color="text.primary" component="p" variant="body2">
                      Post your link on social media, blogs
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography align="center" color="text.primary" component="p" variant="body2">
                      Or share with friends — it works anywhere.
                    </Typography>
                  </Box>

              </Grid>

              {/* Column 3 */}
              <Grid xs={12} md={4}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SvgColor src="/assets/icons/dollar.svg" color="info" sx={{ width: '100%', height: '100%' }} />
                </Box>
                <Box sx={{ mt: 4, mb: 3 }}>
                  <Typography align="center" color="text.primary" component="p" variant="h5">
                    Earn 30% Commission
                  </Typography>
                </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography align="center" color="text.primary" component="p" variant="body2">
                      Get paid every month.
                    </Typography>
                  </Box>
                <Box sx={{ mt: 2, mb: 6 }}>
                  <Typography align="center" color="text.primary" component="p" variant="body2">
                    The more you share, the more you earn.
                  </Typography>
                </Box>

              </Grid>
            </Grid>



            <Box sx={{ mt: 8, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ mb: 2, color: 'text.primary' }}>
                Ready to start earning?
              </Typography>
              <Typography variant="body1" sx={{ mt: 4, mb:1, color: 'text.secondary' }}>
                Join our affiliate program today and earn 30% recurring commission

              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>

                For the lifetime of every subscription you refer. Instant setup. Unlimited potential.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => router.push('/affiliates-register')}
                sx={{ px: 5, py: 1.5, fontSize: '1.1rem' }}
              >
                Get Your Referral Link
              </Button>
              <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
                It’s 100% free to join — start earning in minutes.
              </Typography>
            </Box>

          </Container>
        </Box>

      </Box>
    </>
  );
};

export default AffiliatesSection;
