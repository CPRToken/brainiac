// src/sections/dashboard/account/account-general-settings.tsx
import type { FC } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { useTranslation } from "react-i18next";
import { tokens } from "src/locales/tokens";
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { auth, db } from "../../../libs/firebase";
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import Box from "@mui/material/Box";

interface AccountGeneralSettingsProps {
  uid?: string;

  email: string;
  role?: string;
  priceId?: string;
  name?: string;
  plan?: string;
}

export const AccountGeneralSettings: FC<AccountGeneralSettingsProps> = (props) => {
  const { name, email, plan, priceId, role } = props;
  const [uid, setUid] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(plan || 'Free');
  const { t } = useTranslation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!uid) return;
      const userDocRef = doc(db, 'users', uid);
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setIsPublic(data.isPublic || false);
        setCurrentPlan(priceIdToPlan(data.priceId || ''));
      }
    };
    fetchUserData();
  }, [uid, priceId]);



  const priceIdToPlan = (priceId: string): string => {
    const priceToPlan: Record<string, string> = {
      'price_1PcU3uFM88NqciSfKaualog4': 'Basic',
      'price_1PcU32FM88NqciSfBmxaHtfM': 'Premium',
      'price_1PcU4VFM88NqciSf5jQlo86h': 'Business',
      'price_canceled': 'Canceled'
    };
    return priceToPlan[priceId] || 'Free';
  };

  return (
    <Stack spacing={4} {...props}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={4}>
              <Typography variant="h6">{t(tokens.nav.details)}</Typography>
            </Grid>
            <Grid xs={12} md={8}>
              <Stack spacing={3}>
                <Stack alignItems="center" direction="row" spacing={2}>


                </Stack>

                <Stack alignItems="center" direction="row" spacing={2}>
                  <TextField
                    defaultValue={name}
                    disabled={!isEditingName}
                    label={t(tokens.form.name)}
                    sx={{ flexGrow: 1 }}
                  />
                </Stack>
                <Stack alignItems="center" direction="row" spacing={2}>
                  <TextField
                    defaultValue={email}
                    disabled
                    label={t(tokens.form.email)}
                    required
                    sx={{
                      flexGrow: 1,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderStyle: 'dashed',
                      },
                    }}
                  />
                </Stack>

                <Stack alignItems="center" direction="row" spacing={2}>
                  <TextField
                    defaultValue={currentPlan}
                    disabled
                    label={t(tokens.form.plan)}
                    required
                    sx={{
                      flexGrow: 1,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderStyle: 'dashed',
                      },
                    }}
                  />
                </Stack>

              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={4}>
              <Typography variant="h6">{t(tokens.form.manageSub)}</Typography>
            </Grid>
            <Grid xs={12} sm={12} md={8}>
              <Stack divider={<Divider />} spacing={3}>
                <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle1">{t(tokens.form.toCancel)}</Typography>
                    <Button
                      variant="outlined"
                      onClick={async () => {
                        const res = await fetch('/api/create-portal-session', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ uid }),
                        });

                        const data = await res.json();
                        if (data.url) {
                          window.location.href = data.url;
                        } else {
                          alert('Failed to open billing portal.');
                        }
                      }}
                    >
                      {t(tokens.form.clickHere)}
                    </Button>

                  </Stack>

                </Stack>
                <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
                  <Stack spacing={1}>

                  </Stack>

                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={4}>
              <Typography variant="h6">Delete Account</Typography>
            </Grid>
            <Grid xs={12} md={8}>
              <Stack alignItems="flex-start" spacing={3}>
                <Typography variant="subtitle1">
                  Delete your account and all of your source data. This is irreversible.
                </Typography>
                <Button color="error" variant="outlined">
                  Delete account
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
};

AccountGeneralSettings.propTypes = {
  uid: PropTypes.string,
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  priceId: PropTypes.string,
  role: PropTypes.string,
  plan: PropTypes.string,
};
