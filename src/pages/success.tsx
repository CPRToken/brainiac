//src/pages/success.tsx
import type { NextPage } from 'next';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {Success} from 'src/sections/components/detail-lists/success';
import { Seo } from 'src/components/seo';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';

import { db } from 'src/libs/firebase';

import { usePageView } from 'src/hooks/use-page-view';
import { Typography } from '@mui/material';
import { Layout as MarketingLayout } from 'src/layouts/marketing';
 import {tokens} from "../locales/tokens";
import {useTranslation} from "react-i18next";



const Page: NextPage = () => {
  const router = useRouter();


  const { t } = useTranslation();





  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);

    // Listen to the user doc in real time
    const unsubscribe = onSnapshot(userDocRef, async (snapshot) => {
      const data = snapshot.data();
      const priceId = data?.priceId;

      // Only proceed once Stripe webhook has written a real priceId
      if (priceId && priceId !== 'pending') {
        const plan = productIdToPlan(priceId);
        const planStartDate = new Date().toISOString();

        await updateDoc(userDocRef, { plan, planStartDate });
        router.push('/dashboard');
        unsubscribe();
      }
    });

    return unsubscribe;
  }, [router]);

  usePageView();

  return (
    <>
      <Seo title="Success - Subscription" />
      <Box component="main" sx={{ flexGrow: 1, py: 8, mt: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h5"
                      sx={{ flexGrow: 1, py: 2, mt: 3, mb:3 }}>
          {t(tokens.headings.success)}</Typography>


        <Success/>
        </Container>
        </Box>

    </>
  );
};

Page.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default Page;
function productIdToPlan(priceId: string): string {
  const priceToPlan: Record<string, string> =

    {
      'price_1QNpMjI7exj9oAo9ColPjP1G': 'Basic',
      'price_1QNpZYI7exj9oAo9f2IXAwdx': 'Premium',
      'price_1QNpgKI7exj9oAo9DMTVCQBz': 'Business',
      'price_1QNpQPI7exj9oAo9rx2W7jkg': 'BasicYearly',
      'price_1QNpeNI7exj9oAo9mCyQ1FJa': 'PremiumYearly',
      'price_1QNpiKI7exj9oAo9CcI657sF': 'BusinessYearly',
      'price_1QNpX8I7exj9oAo9erM3juYm': 'Basic',
      'price_1QNpl9I7exj9oAo9PaBuwzY2': 'Premium',
      'price_1QNpo4I7exj9oAo9fUqEamTZ': 'Business',
      'price_1QNpV9I7exj9oAo9Aq2lz9Uz': 'BasicYearly',
      'price_1QNppOI7exj9oAo9ufdAPG5x': 'PremiumYearly',
      'price_1QNps4I7exj9oAo9O6sC4IRL': 'BusinessYearly',
      'price_canceled': 'Canceled'
    };

  return priceToPlan[priceId] || 'Unknown';
}
