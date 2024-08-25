//src/pages/auth/firebase/verify-email.tsx
import type { NextPage } from 'next';
import React, { useState } from 'react';
import { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { typography } from "src/theme/typography";
import {tokens} from "src/locales/tokens";
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { Seo } from 'src/components/seo';
import { Layout as AuthLayout } from 'src/layouts/auth/modern-layout';
import { paths } from 'src/paths';
import { auth} from 'src/libs/firebase';
import { useRouter } from 'next/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';



const Page: NextPage = () => {
  const [verified, setVerified] = useState(false);
  const auth = getAuth();
  const router = useRouter();
    const { t } = useTranslation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.reload().then(() => {
          if (user.emailVerified) {
            setVerified(true);
            router.push('/auth/firebase/login'); // Redirect to dashboard or appropriate page once verified
          }
        });
      }
    });
    return unsubscribe; // Clean up the subscription on unmount
  }, [auth, router]);

  const handleRetry = () => {
    window.location.reload(); // Reloads the current page
  };

  return (
    <div>
      {!verified ? (
        <>
        <Typography
          sx={{
            ...typography.h6,
            pb: 4,

          }}
        >
          {t(tokens.form.verifyEmailPrompt)}
        </Typography>
        <Button variant="contained" onClick={handleRetry}>
          {t(tokens.form.clickHereIfNotRedirected)}
        </Button>
        </>
      ) : (
        <Typography
          sx={{
            ...typography.h6,
            pb: 2,

          }}
        >
          {t(tokens.form.verifyEmailSuccess)}
        </Typography>
      )}
    </div>
  );
}

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
