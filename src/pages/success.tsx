import type { NextPage } from 'next';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import {Success} from 'src/sections/components/detail-lists/success';
import { Seo } from 'src/components/seo';
import { doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';
import type { Profile } from 'src/types/social';
import { db } from 'src/libs/firebase';
import { socialApi } from 'src/api/social/socialApi';
import { usePageView } from 'src/hooks/use-page-view';
import { Typography } from '@mui/material';
import { Layout as MarketingLayout } from 'src/layouts/marketing';
import { Previewer } from 'src/sections/components/previewer';
import {tokens} from "../locales/tokens";
import {useTranslation} from "react-i18next";



const Page: NextPage = () => {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const { t } = useTranslation();




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

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    const updatePlan = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user && profile) {
        const userDocRef = doc(db, 'users', user.uid);
        const priceId = profile.priceId;

        if (priceId) {
          const plan = productIdToPlan(priceId);
          const planStartDate = new Date().toISOString();
          await updateDoc(userDocRef, {
            plan,
            planStartDate: planStartDate
          });

          console.log(`User plan updated to ${plan} with start date ${planStartDate}`);
          router.push('/dashboard');
        } else {
          console.error('Price ID not found');
        }
      } else {
        console.error('User not authenticated or profile not loaded');
      }
    };

    updatePlan();
  }, [profile]);


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
