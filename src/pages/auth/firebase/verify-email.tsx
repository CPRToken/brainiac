//src/pages/auth/firebase/verify-email.tsx
import type { NextPage } from 'next';
import React, { useState } from 'react';
import { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { typography } from "src/theme/typography";
import {tokens} from "src/locales/tokens";
import { useTranslation } from 'react-i18next';


import { Layout as AuthLayout } from 'src/layouts/auth/modern-layout';

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
            router.push('/auth/firebase/login'); // Redirect after verification
          }
        });
      }
    });
    return unsubscribe; // Clean up the subscription on unmount
  }, [auth, router]);

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
