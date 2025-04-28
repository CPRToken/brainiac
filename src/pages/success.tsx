//src/pages/success.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';
import { usePageView } from 'src/hooks/use-page-view';
import { Seo } from 'src/components/seo';
import { Layout as MarketingLayout } from 'src/layouts/marketing';
import { Container, Typography, Box, Stack } from '@mui/material';
import { Success } from 'src/sections/components/detail-lists/success';
import { Previewer } from 'src/sections/components/previewer';
import { tokens } from '../locales/tokens';
import { useTranslation } from 'react-i18next';
import type { NextPage } from 'next';
import type { Profile } from 'src/types/social';
import { socialApi } from 'src/api/social/socialApi';

const Page: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  usePageView();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          await socialApi.getProfile({ uid: user.uid });
          router.push('/dashboard'); // ✅ push immediately
        } else {
          console.error('No user logged in after payment');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <Seo title="Success - Subscription" />
      <Box component="main" sx={{ flexGrow: 1, py: 8, mt: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h5" sx={{ flexGrow: 1, py: 2, mt: 3, mb: 3 }}>
            {t(tokens.headings.success)}
          </Typography>

          <Stack spacing={8}>
            {loading ? (
              <Typography variant="body2">Loading your subscription details...</Typography>
            ) : (
              <Previewer title={t(tokens.form.thankYouSubscribe)}>
                <></> {/* empty, required for TS */}
              </Previewer>


            )}
          </Stack>

          <Success />
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default Page;
