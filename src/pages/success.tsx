import type { NextPage } from 'next';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import {Success} from 'src/sections/components/detail-lists/success';
import { Seo } from 'src/components/seo';
import { doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useSettings } from 'src/hooks/use-settings';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import type { Profile } from 'src/types/social';
import { db } from 'src/libs/firebase';
import { socialApi } from 'src/api/social/socialApi';
import { usePageView } from 'src/hooks/use-page-view';
import { Typography } from '@mui/material';
import { Layout as MarketingLayout } from 'src/layouts/marketing';
import { Previewer } from 'src/sections/components/previewer';
import {tokens} from "../locales/tokens";
import {useTranslation} from "react-i18next";


const components: { element: JSX.Element; title: string }[] = [

  {
    element: <Success />,
    title: 'Success',
  },
];

const Page: NextPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { t } = useTranslation();
  const settings = useSettings();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const uid = currentUser.uid;
        try {
          const userData = await socialApi.getProfile({ uid });

          if (!userData) {
            console.error("User data not found");
            return;
          }

          setUser(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);


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
        } else {
          console.error('Price ID not found in user data');
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
      <Seo title="Components: Detail Lists" />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
            mt: 6,
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h5">{t(tokens.headings.success)}</Typography>
            <Stack spacing={8}>
              {components.map((component) => (
                <Previewer key={component.title} title={component.title}>
                  {component.element}
                </Previewer>
              ))}
            </Stack>
          </Container>
        </Box>

    </>
  );
};

Page.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default Page;
function productIdToPlan(priceId: string): string {
  const priceToPlan: Record<string, string> = {
    'price_1PgQI4I7exj9oAo949UmThhH': 'Basic',
    'price_1PgQJsI7exj9oAo9mUdbE0ZX': 'Premium',
    'price_1PgQKSI7exj9oAo9acr903Ka': 'Business',
    'price_1PjDoqI7exj9oAo95jqY8uSw': 'BasicYearly',
    'price_1PjDpjI7exj9oAo9UkvkaR6x': 'PremiumYearly',
    'price_1PjDr8I7exj9oAo9lm4zAEDn': 'BusinessYearly',
    'price_1Pk4zmI7exj9oAo9khc4OT16': 'Basic',
    'price_1Pk4zkI7exj9oAo9N92hGKqe': 'Premium',
    'price_1Pk4ziI7exj9oAo95ZIL3sby': 'Business',
    'price_1Pk4zgI7exj9oAo9DSyIUy8G': 'BasicYearly',
    'price_1Pk4zeI7exj9oAo9eUPovxQl': 'PremiumYearly',
    'price_1Pk4zbI7exj9oAo9qsyipPNj': 'BusinessYearly',
    'price_canceled': 'Canceled'
  };

  return priceToPlan[priceId] || 'Unknown';
}
